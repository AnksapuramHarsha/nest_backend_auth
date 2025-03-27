import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { PatientService } from '../patient/patient.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InitiatePhoneVerificationDto } from './dto/initiate-phone-verification.dto';
import { ValidatePhoneOtpDto } from './dto/validate-phone-otp.dto';

@ApiTags('Verification')
@ApiBearerAuth()
@ApiSecurity('bearer')
@Controller('api/v1/verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
  constructor(
    private verificationService: VerificationService,
    private patientService: PatientService,
  ) {}

  @Post('phone')
  @ApiOperation({ summary: 'Initiate phone verification' })
  @ApiBody({ type: InitiatePhoneVerificationDto })
  @ApiResponse({ status: 200, description: 'Verification initiated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async initiatePhoneVerification(@Body() dto: InitiatePhoneVerificationDto) {
    try {
      if (dto.patientId) {
        const patient = await this.patientService.findOne(dto.patientId);
        if (!patient) {
          throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
        }
        if (!dto.phoneNumber && patient.contact) {
          const contact = patient.contact as any;
          dto.phoneNumber = contact.phone;
          dto.countryCode = contact.countryCode || '+91';
        }
      }
      if (!dto.phoneNumber) {
        throw new HttpException('Phone number is required', HttpStatus.BAD_REQUEST);
      }
      return await this.verificationService.initiatePhoneVerification(dto.phoneNumber, dto.countryCode || '+91');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate verification';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('phone/validate')
  @ApiOperation({ summary: 'Validate phone OTP' })
  @ApiBody({ type: ValidatePhoneOtpDto })
  @ApiResponse({ status: 200, description: 'OTP validated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async validatePhoneOTP(@Body() dto: ValidatePhoneOtpDto) {
    try {
      const validationResult = await this.verificationService.validatePhoneOTP(
        dto.phoneNumber,
        dto.countryCode || '1',
        dto.otp
      );
      if (validationResult.success && dto.patientId) {
        await this.patientService.markPhoneAsVerified(dto.patientId);
      }
      return validationResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate OTP';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
