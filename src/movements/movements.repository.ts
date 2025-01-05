import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateMovement,
  IMovementRepository,
  Movement,
  UpdateMovement,
} from '@/movements/entities/movement.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class MovementsRepository implements IMovementRepository {
  private readonly movements: PrismaService['movments'];

  constructor(private readonly model: PrismaService) {
    this.movements = model.movments;
  }

  async create(data: CreateMovement): Promise<Movement> {
    return await this.movements.create({ data });
  }

  async update(id: number, data: UpdateMovement): Promise<Movement> {
    return await this.movements.update({
      where: { id_movment: id },
      data,
    });
  }

  async findAll(query: Prisma.movmentsFindManyArgs): Promise<Movement[]> {
    return await this.movements.findMany(query);
  }

  async findById(id: number): Promise<Movement> {
    return await this.movements.findUnique({
      where: { id_movment: id },
    });
  }
}
