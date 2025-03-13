import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './entities/patient.entity';
import { PatientTranslation } from './entities/patient-translation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Patient, PatientTranslation]),
      ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
