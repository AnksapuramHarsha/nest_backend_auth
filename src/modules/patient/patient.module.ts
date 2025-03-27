import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './entities/patient.entity';
import { PatientTranslation } from './entities/patient-translation.entity';
import { PatientRegistrationStatus } from './entities/patient-registration-status.entity';
import { PatientRegistrationStatusController } from './patient-registration-status-controller';
import { PatientRegistrationStatusService } from './patient-registration-status-service';
import { Configuration } from '../config/entities/config.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Patient, PatientTranslation, PatientRegistrationStatus, Configuration]),
      ],
  controllers: [PatientController, PatientRegistrationStatusController],
  providers: [PatientService, PatientRegistrationStatusService],
  exports: [PatientService, PatientRegistrationStatusService],
})
export class PatientModule {}
