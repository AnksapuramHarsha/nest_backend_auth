// src/patient/dto/create-patient.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsUUID, IsNotEmpty, IsString, IsOptional, 
   IsBoolean, IsObject, ValidateNested, IsISO8601
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

export class CreatePatientDto {
  @ApiProperty()
  @IsUUID()
  networkId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  upid!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  abha?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mrn?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  identifier?: Record<string, any>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  namePrefix?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameGiven!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameMiddle?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameFamily!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameSuffix?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  preferredName?: string;

  @ApiProperty()
  @IsISO8601()
  birthDate!: Date ;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  deathDate?: Date ;

  @ApiProperty({ enum: GenderIdentity, enumName: 'GenderIdentity' })
  @IsOptional()
  genderIdentity?: GenderIdentity;

  @ApiProperty({ enum: BiologicalSex, enumName: 'BiologicalSex' })
  @IsOptional()
  biologicalSex?: BiologicalSex;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  preferredPronouns?: string;

  @ApiPropertyOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiPropertyOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDTO)
  @IsOptional()
  contact?: ContactDTO;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  interpreterRequired?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  race?: Record<string, any>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ethnicity?: string;

  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDTO)
  @IsOptional()
  emergencyContacts?: EmergencyContactDTO[];

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  preferredPharmacy?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  primaryCareProvider?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  active?: boolean = true;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bloodType?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  organDonor?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  advanceDirectives?: Record<string, any>;

  @ApiProperty()
  @IsUUID()
  createdBy!: string;

  @ApiProperty()
  @IsUUID()
  updatedBy!: string;
}

