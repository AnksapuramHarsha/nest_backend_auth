// src/verification/dto/validate-phone-otp.dto.ts
import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class ValidatePhoneOtpDto {
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsNotEmpty()
  @IsString()
  otp!: string;
}