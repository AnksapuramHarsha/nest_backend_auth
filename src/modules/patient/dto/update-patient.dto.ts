// src/patient/dto/update-patient.dto.ts
// src/patient/dto/update-patient.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsNumber()
  @IsOptional()
  statusId?: number;
}
