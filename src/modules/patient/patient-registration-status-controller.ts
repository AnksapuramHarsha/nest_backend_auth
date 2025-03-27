// src/patient/controllers/patient-registration-status.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PatientRegistrationStatusService } from './patient-registration-status-service';
import { CreatePatientRegistrationStatusDto, UpdatePatientRegistrationStatusDto } from './dto/patient-registration-status-dto';
import { PatientRegistrationStatus } from './entities/patient-registration-status.entity';

@Controller('patient-registration-statuses')
export class PatientRegistrationStatusController {
  constructor(private readonly patientRegistrationStatusService: PatientRegistrationStatusService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStatusDto: CreatePatientRegistrationStatusDto): Promise<PatientRegistrationStatus> {
    return this.patientRegistrationStatusService.create(createStatusDto);
  }

  @Get()
  findAll(): Promise<PatientRegistrationStatus[]> {
    return this.patientRegistrationStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PatientRegistrationStatus> {
    return this.patientRegistrationStatusService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdatePatientRegistrationStatusDto,
  ): Promise<PatientRegistrationStatus> {
    return this.patientRegistrationStatusService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.patientRegistrationStatusService.remove(+id);
  }

  @Post('init')
  @HttpCode(HttpStatus.NO_CONTENT)
  initializeStatuses(): Promise<void> {
    return this.patientRegistrationStatusService.createInitialStatuses();
  }
}
