// src/patient/dto/update-patient.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
