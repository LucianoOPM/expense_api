import { Injectable } from '@nestjs/common';
import {
  CreateUser,
  IUserRepository,
  UpdateUser,
  User,
  UserQuery,
} from '@/users/entities/user.entity';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly model: PrismaService) {}

  async findAll(query?: UserQuery): Promise<User[]> {
    return await this.model.users.findMany(query);
  }

  async count(query: UserQuery) {
    return await this.model.users.count({
      where: query.where,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.model.users.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return await this.model.users.findUnique({
      where: { id_user: id },
    });
  }

  async create(data: CreateUser): Promise<User> {
    return await this.model.users.create({ data });
  }

  async update(id: number, data: UpdateUser): Promise<User> {
    return await this.model.users.update({
      where: { id_user: id },
      data,
    });
  }
}
