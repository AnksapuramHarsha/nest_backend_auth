import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Version,
  
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBody , ApiConsumes} from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { ApiFile } from '../../decorators/swagger.schema.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { AuthService } from './auth.service.ts';
import { LoginPayloadDto } from './dto/login-payload.dto.ts';
import { UserLoginDto } from './dto/user-login.dto.ts';
import { UserRegisterDto } from './dto/user-register.dto.ts';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
    @Req() req: Request,
  ): Promise<LoginPayloadDto> {
    console.log('Incoming Data:', userLoginDto);
    console.log('Incoming Data (Raw):', req.body);
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken(userEntity);

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
@HttpCode(HttpStatus.OK)
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'Alice' },
      lastName: { type: 'string', example: 'Smith' },
      email: { type: 'string', example: 'alice.smith@example.com' },
      password: { type: 'string', example: 'SecurePass123!' },
      phone: { type: 'string', example: '+1234567890' },
      role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
      organizationId: { type: 'string', format: 'uuid', example: 'd3b5dfe8-85cd-4921-8d06-b5eef0998664' },
      networkId: { type: 'string', format: 'uuid', example: '82f4cdc9-2945-4345-95db-3f1f9e640bbf' },
      avatar: { type: 'string', format: 'binary' },
    },
    required: ['firstName', 'lastName', 'email', 'password', 'role', 'organizationId', 'networkId'],
  },
})
@ApiOkResponse({
  type: UserDto,
  description: 'Successfully Registered',
  schema: {
    example: {
      id: '0e8f4e92-7894-4e9b-9f4c-53b0c4b9e4c1',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      phone: '+1234567890',
      role: 'USER',
      organizationId: 'd3b5dfe8-85cd-4921-8d06-b5eef0998664',
      networkId: '82f4cdc9-2945-4345-95db-3f1f9e640bbf',
      createdAt: '2025-03-30T12:00:00Z',
      updatedAt: '2025-03-30T12:00:00Z',
    },
  },
})
@ApiFile({ name: 'avatar' })
async userRegister(
  @Body() userRegisterDto: UserRegisterDto,
): Promise<UserDto> {
  const createdUser = await this.userService.createUser(
    userRegisterDto,
    userRegisterDto.role,
  );

  return createdUser.toDto({
    isActive: true,
  });
}
  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
