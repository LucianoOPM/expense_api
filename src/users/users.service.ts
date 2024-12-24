import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/users/users.repository';
import {
  CreateUser,
  IncomingSingleQuery,
  UserQuery,
  UpdateUser,
} from './entities/user.entity';
import { hashPassword } from '@/functions/bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUser) {
    try {
      const { password, email, name } = user;
      const hashedPassword = await hashPassword(password);

      const createUser = {
        email,
        name,
        password: hashedPassword,
      };
      const data = await this.userRepository.create(createUser);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(query?: UserQuery) {
    try {
      const users = await this.userRepository.findAll(query);
      const totalQuery = await this.userRepository.count(query);
      return {
        users,
        total: totalQuery,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  findOne(id: number, query: IncomingSingleQuery) {
    try {
      const { earnings = false, expenses = false } = query;
      const user = this.userRepository.findById(id, {
        include: { earnings, expenses },
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, user: UpdateUser) {
    try {
      const { estatus, name, password, role } = user;

      const updateUser = {};
      if (name) {
        updateUser['name'] = name;
      }
      if (typeof estatus === 'boolean') {
        updateUser['is_active'] = estatus;
      }
      if (password) {
        const hashedPassword = await hashPassword(password);
        updateUser['password'] = hashedPassword;
      }
      if (role) {
        updateUser['role'] = role;
      }

      const data = await this.userRepository.update(id, updateUser);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
