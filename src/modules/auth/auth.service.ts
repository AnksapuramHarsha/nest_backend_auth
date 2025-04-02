import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validateHash } from '../../common/utils.ts';
import { TokenType } from '../../constants/token-type.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import type { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { TokenPayloadDto } from './dto/token-payload.dto.ts';
import type { UserLoginDto } from './dto/user-login.dto.ts';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async login(user: UserEntity) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organization: user.organization?.id,
      network: user.network?.id,
      type: TokenType.ACCESS_TOKEN,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async createAccessToken(user: UserEntity): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: user.role,
        organization: user.organization?.id,
        network: user.network?.id,
        type: TokenType.ACCESS_TOKEN,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }
    return user!;
  }
}
