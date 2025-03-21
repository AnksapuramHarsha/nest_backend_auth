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

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(PatientTranslation) private translationRepo: Repository<PatientTranslation>,
  ) {}

  async create(createPatientDto: CreatePatientDto,user: UserEntity, language: string): Promise<PatientResponseDto> {
    try {
      // Check if patient with same UPID exists in the network
      const existingPatient = await this.patientRepository.findOne({
        where: {
          networkId: createPatientDto.networkId,
          upid: createPatientDto.upid,
        },
      });

      if (existingPatient) {
        throw new ConflictException(
          `Patient with UPID ${createPatientDto.upid} already exists in this network`,
        );
      }

      // Process dates
      const patient = this.patientRepository.create({
        ...createPatientDto,
        birthDate: createPatientDto.birthDate ? new Date(createPatientDto.birthDate) : null,
        deathDate: createPatientDto.deathDate ? new Date(createPatientDto.deathDate) : null,
        preferredLanguage: language,
        createdBy: user.id,
      });

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
      order: {
        nameFamily: 'ASC',
        nameGiven: 'ASC',
      },
    });
    
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  async findByNetwork(networkId: string): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      where: { networkId },
      order: {
        nameFamily: 'ASC',
        nameGiven: 'ASC',
      },
    });
    
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  async findOne(id: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    return this.mapToResponseDto(patient);
  }

  async findByUpid(networkId: string, upid: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { 
        networkId,
        upid,
      },
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with UPID ${upid} not found in network ${networkId}`);
    }
    
    return this.mapToResponseDto(patient);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
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

  async remove(id: string): Promise<void> {
    const result = await this.patientRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    // Soft delete by setting active to false
    await this.patientRepository.save({
      ...patient,
      active: false,
      updatedBy: userId,
      version: patient.version + 1,
    });
  }

  async restore(id: string, userId: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
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
      id: patient.id,
      networkId: patient.networkId,
      upid: patient.upid,
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
      preferredPharmacy: patient.preferredPharmacy,
      primaryCareProvider: patient.primaryCareProvider,
      active: patient.active,
      preferences: patient.preferences,
      bloodType: patient.bloodType,
      organDonor: patient.organDonor,
      advanceDirectives: patient.advanceDirectives,
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
  async deleteContact(id: string): Promise<Patient> {
    const patient = await this.getPatientById(id);
    if (!patient.contact) {
        throw new NotFoundException('Contact details not found');
      }
    
      patient.contact = null;  // ✅ Properly removes the contact details
      return this.patientRepository.save(patient);
  }

  // ✅ Private helper method to fetch a patient by ID
  private async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

}
