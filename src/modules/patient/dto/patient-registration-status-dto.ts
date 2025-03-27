// src/patient/dto/patient-registration-status.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePatientRegistrationStatusDto {
  @IsString()
  @IsNotEmpty()
  statusCode!: string;

  @IsString()
  @IsNotEmpty()
  statusName!: string;

  @IsString()
  @IsOptional()
  statusDescription?: string;
}

export class UpdatePatientRegistrationStatusDto {
  @IsString()
  @IsOptional()
  statusCode?: string;

  @IsString()
  @IsOptional()
  statusName?: string;

  @IsString()
  @IsOptional()
  statusDescription?: string;
}
