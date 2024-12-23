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
import { Response } from 'express';
import { LoginDto, RegisterDto } from '@/auth/dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
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
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const { email, password } = body;
      const { token } = await this.authService.login({ email, password });

      res
        .status(200)
        .cookie('auth_token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
        })
        .redirect('/api/v1/');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('auth_token').status(200).json({ ok: true });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const user = req.user;
    return user;
  }
}