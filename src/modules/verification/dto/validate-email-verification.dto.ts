// src/verification/dto/validate-email-verification.dto.ts
import { IsString, IsOptional, IsUUID, IsEmail, IsNotEmpty } from 'class-validator';

export class ValidateEmailVerificationDto {
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  code!: string;
}