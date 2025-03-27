// src/verification/verification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Initiates phone verification by sending OTP
   * @param phoneNumber The recipient's phone number
   * @param countryCode The country code (e.g., 91 for India)
   * @returns API response
   */
  async initiatePhoneVerification(phoneNumber: string, countryCode: string): Promise<any> {
    try {
      const authKey = this.configService.get<string>('AUTHKEY_API_KEY');
      const senderId = this.configService.get<string>('AUTHKEY_SENDER_ID');
      const templateId = this.configService.get<string>('AUTHKEY_TEMPLATE_ID');
      const entityId = this.configService.get<string>('AUTHKEY_ENTITY_ID');
      
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in cache/session for later validation (you may want to use Redis or other storage)
      // For simplicity, we'll assume you have a method to store this
      await this.storeOTP(phoneNumber, otp);
      
      // For India, we need to include DLT parameters
      const isIndian = countryCode === '91';
      
      const url = 'https://api.authkey.io/request';
      const params: Record<string, any> = {
        authkey: authKey,
        mobile: phoneNumber,
        country_code: countryCode,
        sms: `Your verification code is ${otp}`,
        sender: senderId,
      };
      
      // Add DLT parameters for India
      if (isIndian && entityId && templateId) {
        params.pe_id = entityId;
        params.template_id = templateId;
      }
      
      const response = await this.httpService.get(url, { params }).toPromise();
      
      this.logger.log(`OTP sent to ${countryCode}${phoneNumber}`);
      return {
        success: true,
        message: 'Verification code sent successfully',
        data: response?.data ?? null
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(`Failed to send OTP: ${err.message}`, err.stack);
      return {
        success: false,
        message: 'Failed to send verification code',
        error: (error as Error).message
      };
    }
  }
  
  /**
   * Validates the OTP entered by the user
   * @param phoneNumber The phone number
   * @param countryCode The country code
   * @param otp The OTP entered by the user
   * @returns Validation result
   */
  async validatePhoneOTP(phoneNumber: string, countryCode: string, otp: string): Promise<any> {
    try {
      // For production, you should validate against a stored OTP
      // This implementation assumes you have a method to retrieve stored OTP
      const storedOTP = await this.retrieveOTP(phoneNumber);
      
      if (!storedOTP) {
        return {
          success: false,
          message: 'No active verification code found'
        };
      }
      
      if (storedOTP === otp) {
        // Remove the OTP after successful validation
        await this.removeOTP(phoneNumber);
        
        this.logger.log(`Phone number ${countryCode}${phoneNumber} successfully verified`);
        return {
          success: true,
          message: 'Phone number verified successfully'
        };
      } else {
        this.logger.warn(`Invalid OTP attempt for ${countryCode}${phoneNumber}`);
        return {
          success: false,
          message: 'Invalid verification code'
        };
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`OTP validation failed: ${err.message}`, err.stack);
      return {
        success: false,
        message: 'Verification failed',
        error: (error as Error).message
      };
    }
  }
  
  // Utility methods for OTP storage (implement with your preferred storage method)
  private async storeOTP(phoneNumber: string, otp: string): Promise<void> {
    // In a real application, store in Redis, database, etc.
    // For example, if using Redis:
    // await this.redisService.set(`otp:${phoneNumber}`, otp, 'EX', 600); // expires in 10 minutes
    
    // This is a placeholder implementation
    console.log(`Storing OTP ${otp} for ${phoneNumber}`);
  }
  
  private async retrieveOTP(phoneNumber: string): Promise<string | null> {
    // In a real application, retrieve from Redis, database, etc.
    // For example, if using Redis:
    // return await this.redisService.get(`otp:${phoneNumber}`);
    
    // This is a placeholder implementation
    // For demo purposes, just return a fixed OTP
    return phoneNumber; // Replace with actual implementation
  }
  
  private async removeOTP(phoneNumber: string): Promise<void> {
    // In a real application, remove from Redis, database, etc.
    // For example, if using Redis:
    // await this.redisService.del(`otp:${phoneNumber}`);
    
    // This is a placeholder implementation
    console.log(`Removing OTP for ${phoneNumber}`);
  }
}