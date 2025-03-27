// src/patient/dto/create-patient.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { 
  IsUUID, IsNotEmpty, IsString, IsOptional, 
   IsBoolean, IsObject,
   IsDate,
   IsEnum,
   IsNumber,
   IsDateString
} from 'class-validator';
import { GenderIdentity, BiologicalSex } from '../entities/patient.entity';

export class AddressDto {
  @ApiProperty()
  @IsString()
  line1!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  state!: string;

  @ApiProperty()
  @IsString()
  postalCode!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;
}

export class ContactDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mobilePhone?: string;
}

export class CreateContactDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;
  
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    mobilePhone?: string;
  }
  

export class EmergencyContactDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  relationship!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;
}

// src/patient/dto/create-patient.dto.ts

export class CreatePatientDto {
  @IsUUID()
  @IsNotEmpty()
  networkId!: string;

  @IsString()
  @IsOptional()
  abha?: string;

  @IsString()
  @IsOptional()
  mrn?: string;
  
  @IsObject()
  @IsOptional()
  identifier?: Record<string, any>;

  @IsString()
  @IsOptional()
  namePrefix?: string;

  @IsString()
  @IsNotEmpty()
  nameGiven!: string;

  @IsString()
  @IsOptional()
  nameMiddle?: string;

  @IsString()
  @IsNotEmpty()
  nameFamily!: string;

  @IsString()
  @IsOptional()
  nameSuffix?: string;

  @IsString()
  @IsOptional()
  preferredName?: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate!: Date;

  @IsDate()
  @IsOptional()
  deathDate?: Date;

  @IsEnum(GenderIdentity)
  @IsOptional()
  genderIdentity?: GenderIdentity;

  @IsEnum(BiologicalSex)
  @IsOptional()
  biologicalSex?: BiologicalSex;

  @IsString()
  @IsOptional()
  preferredPronouns?: string;

  @IsObject()
  @IsOptional()
  address?: Record<string, any>;

  @IsObject()
  @IsOptional()
  contact?: Record<string, any>;

  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @IsBoolean()
  @IsOptional()
  interpreterRequired?: boolean;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsObject()
  @IsOptional()
  race?: Record<string, any>;

  @IsString()
  @IsOptional()
  ethnicity?: string;

  @IsObject()
  @IsOptional()
  emergencyContacts?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  preferredPharmacy?: string;

  @IsUUID()
  @IsOptional()
  primaryCareProvider?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsBoolean()
  @IsOptional()
  organDonor?: boolean;

  @IsObject()
  @IsOptional()
  advanceDirectives?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  statusId?: number;

  @IsUUID()
  @IsOptional()
  createdBy!: string;

  @IsUUID()
  @IsOptional()
  updatedBy!: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;
}



