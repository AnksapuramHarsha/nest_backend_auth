// src/verification/verification.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PatientModule
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService]
})
export class VerificationModule {}