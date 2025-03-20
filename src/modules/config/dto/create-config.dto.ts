import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject, IsUUID } from 'class-validator';

export class CreateConfigDto {
  @ApiProperty({ example: 'system', description: 'Configuration category' })
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty({ example: 'theme', description: 'Configuration key' })
  @IsNotEmpty()
  @IsString()
  key!: string;

  @ApiProperty({ example: 'dark', description: 'Configuration value (can be any type)' })
  @IsNotEmpty()
  value: any;

  @ApiProperty({
    example: {
      isOverridden: true,
      parentValue: 'light',
      locales: { en: 'Dark Mode', fr: 'Mode Sombre' },
      description: 'Theme setting for UI',
    },
    description: 'Optional metadata for the configuration',
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    isOverridden?: boolean;
    parentValue?: any;
    locales?: Record<string, any>;
    description?: string;
  };

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: false })
  @IsOptional()
  @IsUUID()
  networkId?: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: false })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
