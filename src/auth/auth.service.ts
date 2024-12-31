import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/users/users.repository';
import { Login, Register } from './entities/auth.entity';
import { hashPassword, comparePassword } from '@/functions/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: Register) {
    try {
      const { name, email, password } = user;
      const hashedPassword = await hashPassword(password);
      const userEmail = await this.userRepository.findByEmail(email);
      if (userEmail) {
        throw new Error('Email already exists');
      }
      const userBody = {
        email,
        name,
        password: hashedPassword,
      };
      return await this.userRepository.create(userBody);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(user: Login) {
    try {
      const { email, password } = user;
      const userBody = await this.userRepository.findByEmail(email);
      if (!userBody) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await comparePassword(
        password,
        userBody.password,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const payload = {
        sub: userBody.id_user,
        username: userBody.name,
        role: userBody.role,
      };
      const token = await this.jwtService.signAsync({ user: payload });
      return {
        accessToken: token,
        user: {
          name: userBody.name,
          email: userBody.email,
          role: userBody.role,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
