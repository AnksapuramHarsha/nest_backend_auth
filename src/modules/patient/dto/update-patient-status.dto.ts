import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdatePatientStatusDto {
  @IsNumber()
  @IsNotEmpty()
  statusId!: number;
}