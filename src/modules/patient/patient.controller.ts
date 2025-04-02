import { 
    Controller, Get, Post,Put, Body, Patch, Param, Delete, 
    UseGuards, Query, HttpCode, HttpStatus, ParseUUIDPipe, Request, Header
  } from '@nestjs/common';
  import type { RequestWithUser } from '../../interfaces/request-with-user.interface';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { PatientService } from './patient.service';
  import { CreateContactDTO, CreatePatientDto } from './dto/create-patient.dto';

  import { UpdatePatientDto } from './dto/update-patient.dto';
  import { PatientResponseDto } from './dto/patient-response.dto';
  import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
//   import { ContactDTO } from './dto/create-patient.dto';

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
        console.log('✅ req.user content:', JSON.stringify(req.user, null, 2));

        const userId = req.user.id ;
  
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
  
    @Get(':upid')
    @ApiOperation({ summary: 'Get a patient by ID' })
    @ApiResponse({ status: 200, description: 'Return the patient', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    @Header('Cache-Control', 'no-store') 
    async findOne(@Param('upid') upid: string): Promise<PatientResponseDto> {
      return this.patientService.findOne(upid);
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
  
    @Patch(':upid')
    @ApiOperation({ summary: 'Update a patient' })
    @ApiResponse({ status: 200, description: 'Patient updated successfully', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async update(
      @Param('upid') upid: string, 
      @Body() updatePatientDto: UpdatePatientDto,
      @Request() req: RequestWithUser,
    ): Promise<PatientResponseDto> {
      // Set updated by from the authenticated user
      updatePatientDto.updatedBy = req.user.id;
      return this.patientService.update(upid, {...updatePatientDto, updatedBy: req.user.id });
    }
  
    @Delete(':upid')
    @ApiOperation({ summary: 'Delete a patient (hard delete)' })
    @ApiResponse({ status: 204, description: 'Patient deleted successfully' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('upid') upid: string): Promise<void> {
      return this.patientService.remove(upid);
    }
  
    @Patch(':upid/deactivate')
    @ApiOperation({ summary: 'Soft delete a patient' })
    @ApiResponse({ status: 204, description: 'Patient deactivated successfully' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deactivate(
      @Param('upid') upid: string,
      @Request() req: RequestWithUser,
    ): Promise<void> {
      return this.patientService.softDelete(upid, req.user.id);
    }
  
    @Patch(':upid/activate')
    @ApiOperation({ summary: 'Restore a soft-deleted patient' })
    @ApiResponse({ status: 200, description: 'Patient restored successfully', type: PatientResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    async activate(
      @Param('upid') upid: string,
      @Request() req: RequestWithUser,
    ): Promise<PatientResponseDto> {
      return this.patientService.restore(upid, req.user.id);
    }


  // ✅ Get only the contact details of a patient
  @ApiOperation({ summary: 'Get contact details of a patient' })
  @ApiResponse({ status: 200, description: 'Returns contact details' })
  @Get(':upid/contact')
  getContact(@Param('upid') upid: string) {
    return this.patientService.getContact(upid);
  }

  // ✅ Update contact details (partial update)
  @ApiOperation({ summary: 'Update contact details' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @Put(':upid/contact')
  updateContact(@Param('upid') upid: string, @Body() contactDto: CreateContactDTO) {
    return this.patientService.updateContact(upid, contactDto);
  }

  // ✅ Delete only the contact details
  @ApiOperation({ summary: 'Delete contact details of a patient' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @Delete(':upid/contact')
  deleteContact(@Param('upid') upid: string) {
    return this.patientService.deleteContact(upid);
  }
  }
