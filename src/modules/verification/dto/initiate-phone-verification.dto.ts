// src/verification/dto/initiate-phone-verification.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class InitiatePhoneVerificationDto {
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;
}





