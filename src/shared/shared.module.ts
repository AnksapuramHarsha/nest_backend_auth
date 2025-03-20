import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiConfigService } from './services/api-config.service.ts';
import { AwsS3Service } from './services/aws-s3.service.ts';
import { GeneratorService } from './services/generator.service.ts';
import { TranslationService } from './services/translation.service.ts';
import { ValidatorService } from './services/validator.service.ts';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Ensures config is available globally
    }),
    CqrsModule,
  ],
  providers: [
    ConfigService, // ✅ Add ConfigService so it can be injected
    ApiConfigService,
    ValidatorService,
    AwsS3Service,
    GeneratorService,
    TranslationService,
  ],
  exports: [
    ConfigModule, // ✅ Export ConfigModule for use in other modules
    ConfigService,
    ApiConfigService,
    ValidatorService,
    AwsS3Service,
    GeneratorService,
    TranslationService,
    CqrsModule,
  ],
})
export class SharedModule {}
