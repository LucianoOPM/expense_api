import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Response } from 'express';
import { LoginDto, RegisterDto } from '@/auth/dto/auth.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Public } from '@/decorators/metaData';
import { ConfigService } from '@nestjs/config';
import { JwtCookieGuard } from '@/auth/guards/jwt-cookie.guard';
import { User } from '@/decorators/user.decorators';
import {
  AuthorizedUser,
  RefreshTokenPayload,
} from '@/auth/entities/auth.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('/register')
  @Public()
  async create(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const { name, email, password } = body;
      const user = await this.authService.create({
        name,
        email,
        password,
      });
      const resData = {
        idUser: user.id_user,
        email: user.email,
        name: user.name,
        isActive: user.is_active,
      };
      res.status(201).json({ ok: true, data: resData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @Post('/refresh')
  @UseGuards(JwtCookieGuard)
  async refresh(
    @User() user: RefreshTokenPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(user);
    const isProd = this.config.get('env') === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    return { ok: true, accessToken };
  }

  @Post('/login')
  @Public()
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(body);
      const isProd = this.config.get('env') === 'production';

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      return { ok: true, accessToken };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    res
      .clearCookie('token')
      .status(200)
      .json({ ok: true, message: 'Logged out successfully' });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User() user: AuthorizedUser) {
    return user;
  }
}
