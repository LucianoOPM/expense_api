import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '@/auth/dto/auth.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { Public } from '@/secure/metaData';
import { ConfigService } from '@nestjs/config';

@Controller()
@UseGuards(JwtAuthGuard)
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

  @Post('/login')
  @Public()
  async login(@Body() body: LoginDto) {
    try {
      const { email, password } = body;
      const { accessToken, user } = await this.authService.login({
        email,
        password,
      });
      return { ok: true, user, accessToken };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    res
      .clearCookie('token')
      .status(200)
      .json({ ok: true, message: 'Logged out successfully' });
  }

  @Get('/me')
  async getMe(@Req() req: Request) {
    const user = req.user;
    return user;
  }
}
