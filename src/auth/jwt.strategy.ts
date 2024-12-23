import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies['auth_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('secretKey'),
    });
  }
  async validate(payload: any) {
    return { idUser: payload.sub, username: payload.username };
  }
}
