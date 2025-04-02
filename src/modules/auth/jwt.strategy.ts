import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import { UserService } from '../user/user.service.ts';
import { JwtPayload } from 'interfaces/JwtPayload.ts';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT payload:', payload);
    const user = await this.userService.findOne({ id: payload.id as Uuid });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
