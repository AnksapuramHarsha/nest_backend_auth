import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreateContactDTO, CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { PatientTranslation } from './entities/patient-translation.entity';
import { UserEntity } from 'modules/user/user.entity';
import { ContactDTO } from './dto/create-patient.dto';
import { Configuration } from '../config/entities/config.entity'; // Adjust the path as needed
import { PatientRegistrationStatus } from './entities/patient-registration-status.entity';
// import { Organization } from '../organization/entities/organization.entity'; // Adjust the path as needed
// import { Network } from '../network/entities/network.entity'; // Adjust the path as needed


@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(PatientTranslation) 
    private translationRepo: Repository<PatientTranslation>,
    @InjectRepository(PatientRegistrationStatus)
    private patientRegistrationStatusRepository: Repository<PatientRegistrationStatus>,
    @InjectRepository(Configuration) 
    private readonly configRepository: Repository<Configuration>,
    // @InjectRepository(Organization)
    // private readonly organizationRepository: Repository<Organization>,
    // @InjectRepository(Network)
    // private readonly networkRepository: Repository<Network>
  ) {}

  async generateUPID(patient: Patient, user: UserEntity): Promise<string> {
    console.log("🚀 generateUPID() running...");

    const config = await this.configRepository.findOne({
      where: { category: 'upid', key: 'format',
        networkId: user.network?.id,           // ✅ explicitly include
        organizationId: patient.organization.id, },
    });

    if (!config || !config.value?.format) {
      throw new Error('No UPID format configured');
    }

    const format = config.value.format;
    const components = config.value.components || [];
    const uniqueCounter = config.value.uniqueCounter || 1;

    // ✅ Fetch values dynamically
    const orgCode = components.includes('ORG') && user.organization
      ? user.organization.name.slice(0, 3).toUpperCase() 
      : 'ORG';
    
    const netCode = components.includes('NET') && user.network
      ? user.network.name.slice(0, 3).toUpperCase() 
      : 'NET';

    const userCode = components.includes('USER') && patient.creator
      ? patient.creator.id.slice(-4).toUpperCase() 
      : 'USER';

    const uniqueNumber = components.includes('UNIQUE')
      ? uniqueCounter.toString().padStart(6, '0') 
      : '';

    // ✅ Generate UPID
    const upid = format
      .replace('${ORG}', orgCode)
      .replace('${NET}', netCode)
      .replace('${USER}', userCode)
      .replace('${UNIQUE}', uniqueNumber);

    // ✅ Increment unique counter and save it back
    config.value.uniqueCounter = uniqueCounter + 1;
    await this.configRepository.save(config);

    console.log('✅ UPID generated:', upid);
    return upid;
  }

  async create(createPatientDto: CreatePatientDto, user: UserEntity, language: string): Promise<PatientResponseDto> {
    try {
      const patient = this.patientRepository.create({
        ...createPatientDto,
        birthDate: createPatientDto.birthDate ? new Date(createPatientDto.birthDate) : null,
        deathDate: createPatientDto.deathDate ? new Date(createPatientDto.deathDate) : null,
        preferredLanguage: language,
        createdBy: user.id,
        updatedBy: user.id,
        organization: {id: user.organization?.id}, // ✅ explicitly assigned
        network: {id: user.network?.id}, // ✅ explicitly assigned
        // Set default status to NEW (statusId: 1)
        statusId: createPatientDto.statusId || 1,
      });

      // ✅ Call generateUPID() before saving
      patient.upid = await this.generateUPID(patient, user);

      const savedPatient = await this.patientRepository.save(patient);

      const translation = this.translationRepo.create({
        patient: savedPatient,
        language,
        nameGiven: createPatientDto.nameGiven,
        nameFamily: createPatientDto.nameFamily,
        preferredName: createPatientDto.preferredName,
        
      });
      await this.translationRepo.save(translation);
      return this.mapToResponseDto(savedPatient, language);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      if (error instanceof Error) {
        throw new Error(`Failed to create patient: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      relations: ['registrationStatus'],
      order: {
        nameFamily: 'ASC',
        nameGiven: 'ASC',
      },
    });
    
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  async findByNetwork(networkId: string): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      where: { network: { id: networkId } },
      relations: ['network'],
      order: {
        nameFamily: 'ASC',
        nameGiven: 'ASC',
      },
    });
    
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  async findOne(upid: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { upid },
      relations: ['network']
    });
    console.log('Fetched patient from DB:', patient); // <-- log this
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${upid} not found`);
    }
    
    return this.mapToResponseDto(patient);
  }

  async findByUpid(networkId: string, upid: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { 
        network: { id: networkId },
        upid,
      },
      relations: ['network'], 
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with UPID ${upid} not found in network ${networkId}`);
    }
    
    return this.mapToResponseDto(patient);
  }

  async update(upid: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { upid },
      relations: ['network'],
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${upid} not found`);
    }
    
    // Process dates if provided
    if (updatePatientDto.birthDate) {
      updatePatientDto.birthDate = new Date(updatePatientDto.birthDate);
    }
    
    if (updatePatientDto.deathDate) {
      updatePatientDto.deathDate = new Date(updatePatientDto.deathDate);
    }
    
    // Merge and save the updated patient
    const updatedPatient = await this.patientRepository.save({
      ...patient,
      ...updatePatientDto,
      version: patient.version + 1, // Increment version
    });
    
    return this.mapToResponseDto(updatedPatient);
  }

  async updateStatus(upid: string, statusId: number, userId: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { upid },
      relations: ['registrationStatus'],
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${upid} not found`);
    }

    // Check if status exists
    const status = await this.patientRegistrationStatusRepository.findOne({
      where: { statusId },
    });

    if (!status) {
      throw new NotFoundException(`Patient Registration Status with ID ${statusId} not found`);
    }
    
    // Update patient status
    const updatedPatient = await this.patientRepository.save({
      ...patient,
      statusId,
      updatedBy: userId,
      version: patient.version + 1,
    });
    
    return this.mapToResponseDto(updatedPatient);
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async softDelete(upid: string, userId: string): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { upid },
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${upid} not found`);
    }
    
    // Soft delete by setting active to false
    await this.patientRepository.save({
      ...patient,
      active: false,
      updatedBy: userId,
      version: patient.version + 1,
    });
  }

  async restore(upid: string, userId: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { upid },
      relations: ['registrationStatus'],
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${upid} not found`);
    }
    
    // Restore by setting active to true
    const restoredPatient = await this.patientRepository.save({
      ...patient,
      active: true,
      updatedBy: userId,
      version: patient.version + 1,
    });
    
    return this.mapToResponseDto(restoredPatient);
  }

  private mapToResponseDto(patient: Patient, language?: string): PatientResponseDto {
    const translation = patient.translations?.find(t => t.language === language);

    return {
      upid: patient.upid,
      networkId: patient.network.id,
      abha: patient.abha,
      mrn: patient.mrn,
      identifier: patient.identifier,
      namePrefix: patient.namePrefix,
      nameGiven: translation ? translation.nameGiven : patient.nameGiven,
      nameMiddle: patient.nameMiddle,
      nameFamily: translation ? translation.nameFamily : patient.nameFamily,
      nameSuffix: patient.nameSuffix,
      preferredName: translation ? translation.preferredName : patient.preferredName,
      birthDate: patient.birthDate,
      deathDate: patient.deathDate,
      genderIdentity: patient.genderIdentity,
      biologicalSex: patient.biologicalSex,
      preferredPronouns: patient.preferredPronouns,
      address: patient.address,
      contact: patient.contact,
      preferredLanguage: patient.preferredLanguage,
      interpreterRequired: patient.interpreterRequired,
      maritalStatus: patient.maritalStatus,
      race: patient.race,
      ethnicity: patient.ethnicity,
      emergencyContacts: patient.emergencyContacts,
    //   preferredPharmacy: patient.preferredPharmacy,
    //   primaryCareProvider: patient.primaryCareProvider,
      active: patient.active,
      preferences: patient.preferences,
      bloodType: patient.bloodType,
      organDonor: patient.organDonor,
      advanceDirectives: patient.advanceDirectives,
      statusId: patient.statusId,
      registrationStatus: patient.registrationStatus ? {
        statusId: patient.registrationStatus.statusId,
        statusCode: patient.registrationStatus.statusCode,
        statusName: patient.registrationStatus.statusName,
        statusDescription: patient.registrationStatus.statusDescription
      } : undefined,
      createdBy: patient.createdBy,
      updatedBy: patient.updatedBy,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      version: patient.version,
    };
  }

  // ✅ Get only the contact details
  async getContact(id: string): Promise<ContactDTO | null> {
    const patient = await this.getPatientById(id);
    return patient.contact || null;
  }

  // ✅ Update contact details (merge existing)
  async updateContact(id: string, contactDto: CreateContactDTO): Promise<Patient> {
    const patient = await this.getPatientById(id);
    if (!patient.contact) {
      patient.contact = {};
    }
    patient.contact.phone = contactDto.phone ?? patient.contact.phone;
    patient.contact.mobilePhone = contactDto.mobilePhone ?? patient.contact.mobilePhone;
  
    return this.patientRepository.save(patient);
  }

  // ✅ Delete contact details (set contact to null)
  async deleteContact(upid: string): Promise<Patient> {
    const patient = await this.getPatientById(upid);
    if (!patient.contact) {
      throw new NotFoundException('Contact details not found');
    }
  
    patient.contact = null;  // ✅ Properly removes the contact details
    return this.patientRepository.save(patient);
  }

  // ✅ Private helper method to fetch a patient by ID
  private async getPatientById(upid: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ 
      where: { upid },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async findByStatus(statusId: number): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      where: { statusId },
      order: {
        nameFamily: 'ASC',
        nameGiven: 'ASC',
      },
    });
    
    return patients.map(patient => this.mapToResponseDto(patient));
  }
  async markPhoneAsVerified(id: string): Promise<void> {
    const patient = await this.findOne(id);

    if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    await this.patientRepository.update(id, {
      phoneVerified: true,
      phoneVerifiedAt: new Date(),
      updatedAt: new Date()
    });
  }

  async markEmailAsVerified(id: string): Promise<void> {
    const patient = await this.findOne(id);

    if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    await this.patientRepository.update(id, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      updatedAt: new Date()
    });
  }

  async updateContactInfo(id: string, contact: Record<string, any>): Promise<Patient> {
    const patient = await this.findOne(id);
    const currentContact = patient.contact || {};
    
    // If phone number has changed, reset verification status
    if (currentContact.phone !== contact.phone) {
      await this.patientRepository.update(id, {
        contact,
        phoneVerified: false,
        phoneVerifiedAt: undefined,
        updatedAt: new Date()
      });
    } 
    // If email has changed, reset verification status
    else if (currentContact.email !== contact.email) {
      await this.patientRepository.update(id, {
        contact,
        emailVerified: false,
        emailVerifiedAt: undefined,
        updatedAt: new Date()
      });
    } 
    // Otherwise just update the contact info
    else {
      await this.patientRepository.update(id, {
        contact,
        updatedAt: new Date()
      });
    }
    
    return this.getPatientById(id);
  }




}