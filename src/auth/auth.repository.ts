import { expirationTime } from '@/functions/tempo';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async saveToken(data: { user_id: number; token: string; id: string }) {
    return await this.prisma.refresh_token.create({
      data: {
        id: data.id,
        id_user: data.user_id,
        token: data.token,
        expires_at: expirationTime(7), // 7 days
      },
    });
  }
  async accessToken(payload: { id_user: number; email: string; role: string }) {
    return await this.jwtService.signAsync(
      {
        sub: payload.id_user,
        username: payload.email,
        role: payload.role,
        type: 'access',
      },
      { expiresIn: this.config.get('accessTokenExpiration') },
    );
  }
  async refreshToken(payload: { id: string; id_user: number }) {
    return await this.jwtService.signAsync(
      {
        sub: payload.id_user,
        idToken: payload.id,
        type: 'refresh',
      },
      { expiresIn: this.config.get('refreshTokenExpiration') },
    );
  }
  async findByToken(token: { token: string; idUser: number }) {
    return await this.prisma.refresh_token.findUnique({
      where: {
        id: token.token,
        is_revoked: false,
        id_user: token.idUser,
        expires_at: { gt: new Date() },
      },
    });
  }
  async revokeToken(uuid: string) {
    return await this.prisma.refresh_token.update({
      where: {
        id: uuid,
      },
      data: {
        is_revoked: true,
      },
    });
  }
}
