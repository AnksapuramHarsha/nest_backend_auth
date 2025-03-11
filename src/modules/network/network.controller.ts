import { Controller, Get } from '@nestjs/common';

@Controller('network')
export class NetworkController {
  @Get()
  getNetworkInfo() {
    return { message: 'Network information' };
  }
}
