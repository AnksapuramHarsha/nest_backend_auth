// src/patient/services/patient-registration-status.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRegistrationStatus } from './entities/patient-registration-status.entity';
import { CreatePatientRegistrationStatusDto, UpdatePatientRegistrationStatusDto } from './dto/patient-registration-status-dto';

@Injectable()
export class PatientRegistrationStatusService {
  constructor(
    @InjectRepository(PatientRegistrationStatus)
    private patientRegistrationStatusRepository: Repository<PatientRegistrationStatus>,
  ) {}

  async create(createStatusDto: CreatePatientRegistrationStatusDto): Promise<PatientRegistrationStatus> {
    const status = this.patientRegistrationStatusRepository.create(createStatusDto);
    return this.patientRegistrationStatusRepository.save(status);
  }

  async findAll(): Promise<PatientRegistrationStatus[]> {
    return this.patientRegistrationStatusRepository.find();
  }

  async findOne(id: number): Promise<PatientRegistrationStatus> {
    const status = await this.patientRegistrationStatusRepository.findOne({ where: { statusId: id } });
    if (!status) {
      throw new NotFoundException(`Patient Registration Status with ID ${id} not found`);
    }
    return status;
  }

  async update(id: number, updateStatusDto: UpdatePatientRegistrationStatusDto): Promise<PatientRegistrationStatus> {
    const status = await this.findOne(id);
    
    Object.assign(status, updateStatusDto);
    
    return this.patientRegistrationStatusRepository.save(status);
  }

  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    await this.patientRegistrationStatusRepository.remove(status);
  }

  async createInitialStatuses(): Promise<void> {
    const initialStatuses = [
      { statusCode: 'NEW', statusName: 'New (Unregistered)', statusDescription: 'Patient record is created but not registered yet.' },
      { statusCode: 'AADHAAR_PENDING', statusName: 'Aadhaar Verification Pending', statusDescription: 'Patient details entered but Aadhaar authentication not completed.' },
      { statusCode: 'AADHAAR_VERIFIED', statusName: 'Aadhaar Verified', statusDescription: 'Aadhaar verification successful, ABHA number can be generated.' },
      { statusCode: 'ABHA_PENDING', statusName: 'ABHA Number Pending', statusDescription: 'Aadhaar verified, but ABHA number not yet generated.' },
      { statusCode: 'ABHA_GENERATED', statusName: 'ABHA Number Generated', statusDescription: 'ABHA number successfully created for the patient.' },
      { statusCode: 'IN_PROGRESS', statusName: 'In Progress', statusDescription: 'Registration process started but not yet completed.' },
      { statusCode: 'REGISTERED', statusName: 'Registered (Active)', statusDescription: 'Registration successfully completed.' },
      { statusCode: 'INCOMPLETE', statusName: 'Incomplete', statusDescription: 'Registration started but missing key details.' },
      { statusCode: 'DUPLICATE', statusName: 'Duplicate (Merged)', statusDescription: 'Patient record identified as a duplicate and merged.' },
      { statusCode: 'ON_HOLD', statusName: 'On Hold', statusDescription: 'Registration temporarily paused due to verification issues.' },
      { statusCode: 'CANCELED', statusName: 'Canceled', statusDescription: 'Registration was canceled before completion.' },
      { statusCode: 'DEACTIVATED', statusName: 'Deactivated (Inactive)', statusDescription: 'Patient record marked inactive due to lack of visits or request.' },
      { statusCode: 'EXPIRED', statusName: 'Expired', statusDescription: 'Patient is marked as deceased.' },
      { statusCode: 'BLOCKED', statusName: 'Blocked', statusDescription: 'Registration flagged due to legal or policy reasons.' },
    ];

    for (const status of initialStatuses) {
      const existingStatus = await this.patientRegistrationStatusRepository.findOne({ where: { statusCode: status.statusCode } });
      if (!existingStatus) {
        await this.create(status);
      }
    }
  }
}
