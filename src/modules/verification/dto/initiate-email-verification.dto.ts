// src/verification/dto/initiate-email-verification.dto.ts
import { IsOptional, IsUUID, IsEmail } from 'class-validator';

export class InitiateEmailVerificationDto {
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsEmail()
  email!: string;
}