import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  upid!: string;

  @IsOptional()
  @IsString()
  abha_no?: string;

  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN')
  mobile_number!: string;

  @IsOptional()
  @IsBoolean()
  mobile_verified?: boolean;

  @IsOptional()
  address?: object;

  @IsOptional()
  @IsBoolean()
  duplicate_flag?: boolean;

  @IsOptional()
  @IsString()
  registration_mode?: string;
}