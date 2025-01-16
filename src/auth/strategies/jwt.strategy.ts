import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  type AccessTokenPayload,
  AuthorizedUser,
} from '@/auth/entities/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-bearer') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('secretKey'),
    });
  }
  async validate(payload: AccessTokenPayload): Promise<AuthorizedUser> {
    const { sub, username, role } = payload;
    return {
      idUser: sub,
      username,
      role: role,
    };
  }
}
