import { IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';

export class QueryConfigDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsUUID()
  networkId?: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;

  @IsOptional()
  @IsString()
  locale?: string;
}
