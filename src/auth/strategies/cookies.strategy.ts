import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '../entities/auth.entity';

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookies',
) {
  constructor(protected readonly config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.headers || !req.headers.cookie) {
          return null;
        }
        const cookie = req.headers.cookie;

        return cookie.split('=')[1];
      },
      ignoreExpiration: false,
      secretOrKey: config.get('secretKey'),
    });
  }
  async validate(payload: RefreshTokenPayload) {
    return payload as RefreshTokenPayload;
  }
}
