import { 
    Controller, Get, Post, Body, Patch, Param, Delete, 
    UseGuards, Query, HttpCode, HttpStatus, ParseUUIDPipe, Request,
  } from '@nestjs/common';
  import type { RequestWithUser } from '../../interfaces/request-with-user.interface';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { PatientService } from './patient.service';
  import { CreatePatientDto } from './dto/create-patient.dto';

  import { UpdatePatientDto } from './dto/update-patient.dto';
  import { PatientResponseDto } from './dto/patient-response.dto';
  import { JwtAuthGuard } from '../../guards/jwt-auth.guard';


  @ApiTags('patients')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('patients')
  export class PatientController {
    constructor(private readonly patientService: PatientService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new patient' })
    @ApiResponse({ status: 201, description: 'Patient created successfully', type: PatientResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: 'Patient with UPID already exists in this network' }) 
    async create(
        @Body() createPatientDto: CreatePatientDto, 
        @Request() req: RequestWithUser
    ): Promise<PatientResponseDto> {
      // Set created and updated by from the authenticated user
        const userId = req.user.id ;
    //   const userEntity: UserEntity = {
    //     ...req.user,
    //     firstName: '', // Add appropriate values
    //     lastName: '',  // Add appropriate values
    //     email: '',     // Add appropriate values
    //     password: '',  // Add appropriate values
    //     phone: '',     // Add appropriate values
    //     avatar: '',    // Add appropriate values
    //     fullName: '',  // Add appropriate values
    //     createdAt: new Date(), // Add appropriate values
    //     updatedAt: new Date(), // Add appropriate values
    //     role: req.user.role as RoleType,
    //     id: req.user.id as unknown as Uuid,
    //     toDto: () => ({
    //       username: req.user.username,
    //       id: req.user.id as unknown as Uuid,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     }),
    //   };
    return this.patientService.create(
        { ...createPatientDto, createdBy: userId, updatedBy: userId }, 
        req.user, 
        'en'
    );
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all patients or filter by network' })
    @ApiResponse({ status: 200, description: 'Return all patients', type: [PatientResponseDto] })
    async findAll(@Query('networkId') networkId?: string): Promise<PatientResponseDto[]> {
      if (networkId) {
        return this.patientService.findByNetwork(networkId);
      }
      return this.patientService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a patient by ID' })
    @ApiResponse({ status: 200, description: 'Return the patient', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PatientResponseDto> {
      return this.patientService.findOne(id);
    }
  
    @Get('network/:networkId/upid/:upid')
    @ApiOperation({ summary: 'Get a patient by network ID and UPID' })
    @ApiResponse({ status: 200, description: 'Return the patient', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async findByUpid(
      @Param('networkId', ParseUUIDPipe) networkId: string,
      @Param('upid') upid: string,
    ): Promise<PatientResponseDto> {
      return this.patientService.findByUpid(networkId, upid);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a patient' })
    @ApiResponse({ status: 200, description: 'Patient updated successfully', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async update(
      @Param('id', ParseUUIDPipe) id: string, 
      @Body() updatePatientDto: UpdatePatientDto,
      @Request() req: RequestWithUser,
    ): Promise<PatientResponseDto> {
      // Set updated by from the authenticated user
      updatePatientDto.updatedBy = req.user.id;
      return this.patientService.update(id, updatePatientDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a patient (hard delete)' })
    @ApiResponse({ status: 204, description: 'Patient deleted successfully' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      return this.patientService.remove(id);
    }
  
    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Soft delete a patient' })
    @ApiResponse({ status: 204, description: 'Patient deactivated successfully' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deactivate(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req: RequestWithUser,
    ): Promise<void> {
      return this.patientService.softDelete(id, req.user.id);
    }
  
    @Patch(':id/activate')
    @ApiOperation({ summary: 'Restore a soft-deleted patient' })
    @ApiResponse({ status: 200, description: 'Patient restored successfully', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async activate(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req: RequestWithUser,
    ): Promise<PatientResponseDto> {
      return this.patientService.restore(id, req.user.id);
    }
  }
