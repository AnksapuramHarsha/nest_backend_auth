// src/patient/dto/patient-response.dto.ts
import { GenderIdentity, BiologicalSex } from '../entities/patient.entity';

export class PatientRegistrationStatusDto {
  statusId!: number;
  statusCode!: string;
  statusName!: string;
  statusDescription?: string;
}

export class PatientResponseDto {
  
  networkId!: string;
  upid!: string;
  abha?: string;
  mrn?: string;
  identifier?: Record<string, any>;
  namePrefix?: string;
  nameGiven!: string;
  nameMiddle?: string;
  nameFamily!: string;
  nameSuffix?: string;
  preferredName?: string;
  birthDate!: Date | null;
  deathDate?: Date | null;
  genderIdentity?: GenderIdentity;
  biologicalSex?: BiologicalSex;
  preferredPronouns?: string;
  address?: Record<string, any>;
  contact?: Record<string, any> | null;
  preferredLanguage?: string;
  interpreterRequired!: boolean;
  maritalStatus?: string;
  race?: Record<string, any>;
  ethnicity?: string;
  emergencyContacts?: Record<string, any>;
  preferredPharmacy?: string;
  primaryCareProvider?: string;
  active!: boolean;
  preferences?: Record<string, any>;
  bloodType?: string;
  organDonor?: boolean;
  advanceDirectives?: Record<string, any>;
  statusId?: number;
  registrationStatus?: PatientRegistrationStatusDto;
  createdBy!: string;
  updatedBy!: string;
  createdAt!: Date;
  updatedAt!: Date;
  version!: number;
}