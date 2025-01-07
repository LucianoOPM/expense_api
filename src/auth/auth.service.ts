import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from '@/users/users.repository';
import {
  Login,
  RefreshTokenPayload,
  Register,
} from '@/auth/entities/auth.entity';
import { hashPassword, comparePassword } from '@/functions/bcrypt';
import { AuthRepository } from '@/auth/auth.repository';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
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
      const userExists = await this.userRepository.findByEmail(email);
      if (!userExists) {
        throw new BadRequestException('Invalid email or password');
      }
      const validPassword = await comparePassword(
        password,
        userExists.password,
      );
      if (!validPassword) {
        throw new BadRequestException('Invalid email or password');
      }
      const accessToken = await this.authRepository.accessToken({
        id_user: userExists.id_user,
        email: userExists.email,
        role: userExists.role,
      });

      const tokenUuid = randomUUID();
      const refreshToken = await this.authRepository.refreshToken({
        id: tokenUuid,
        id_user: userExists.id_user,
      });

      const data = await this.authRepository.saveToken({
        user_id: userExists.id_user,
        token: refreshToken,
        id: tokenUuid,
      });

      if (!data) {
        throw new InternalServerErrorException('Something went wrong');
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  //TODO: Middleware para validar que el access token sea type access
  async refresh(payload: RefreshTokenPayload) {
    try {
      const { idToken, sub, type } = payload;

      if (type !== 'refresh') {
        throw new BadRequestException('Invalid information');
      }
      const userExists = await this.userRepository.findById(sub);
      if (!userExists) {
        throw new BadRequestException('Invalid information');
      }
      const tokenInfo = await this.authRepository.findByToken({
        token: idToken,
        idUser: sub,
      });
      if (!tokenInfo) {
        throw new BadRequestException('Invalid information');
      }

      const uuid = randomUUID();

      const accessToken = await this.authRepository.accessToken({
        id_user: userExists.id_user,
        email: userExists.email,
        role: userExists.role,
      });
      const refreshToken = await this.authRepository.refreshToken({
        id: uuid,
        id_user: userExists.id_user,
      });

      const revoke = await this.authRepository.revokeToken(tokenInfo.id);
      if (!revoke) {
        throw new InternalServerErrorException('Something went wrong');
      }
      const data = await this.authRepository.saveToken({
        user_id: userExists.id_user,
        token: refreshToken,
        id: uuid,
      });
      if (!data) {
        throw new InternalServerErrorException('Something went wrong');
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
