import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';
import { CreateConfigDto } from './create-config.dto';

export class UpdateConfigDto extends PartialType(CreateConfigDto) {
  @ApiProperty({ example: 'light', required: false })
  @IsOptional()
  value?: any;

  @ApiProperty({
    example: {
      isOverridden: false,
      parentValue: 'dark',
      locales: { en: 'Light Mode', fr: 'Mode Lumière' },
      description: 'Updated theme setting',
    },
    description: 'Updated metadata',
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    isOverridden?: boolean;
    parentValue?: any;
    locales?: Record<string, any>;
    description?: string;
  };
}
