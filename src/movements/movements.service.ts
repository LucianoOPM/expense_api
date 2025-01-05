import { BadRequestException, Injectable } from '@nestjs/common';
import { MovementsRepository } from './movements.repository';
import { UserRepository } from '@/users/users.repository';
import { CategoryRepository } from '@/categories/categories.repository';
import { CreateMovement, UpdateMovement } from './entities/movement.entity';
import { IncomingQuery } from './entities/movement.entity';
import { movementDto } from '@/DTO/movement.dto';
import { queryBuild } from '@/movements/utils/query.builder';
import { AuthorizedUser } from '@/auth/entities/auth.entity';

@Injectable()
export class MovementsService {
  constructor(
    protected readonly movementsRepository: MovementsRepository,
    protected readonly usersRepository: UserRepository,
    protected readonly categoriesRepository: CategoryRepository,
  ) {}
  async create(movement: CreateMovement) {
    const { category_id, description, total, created_at, user_id } = movement;
    const userExist = await this.usersRepository.findById(user_id);
    const categoryExist = await this.categoriesRepository.findById(category_id);

    if (!userExist || !userExist.is_active) {
      throw new BadRequestException('User not found');
    }

    if (!categoryExist || !categoryExist.status) {
      throw new BadRequestException('Category not found');
    }
    const insertBody: CreateMovement = {
      category_id,
      user_id,
      description,
      total,
      created_at,
    };

    const data = await this.movementsRepository.create(insertBody);

    return {
      ok: true,
      data: movementDto(data),
    };
  }

  async findAll(user: AuthorizedUser, queryObj: IncomingQuery) {
    const query = queryBuild(user, queryObj);
    const data = await this.movementsRepository.findAll(query);
    const resData = data.map((value) => movementDto(value));
    return {
      ok: true,
      data: resData,
    };
  }

  async findOne(id: number, user: AuthorizedUser) {
    const data = await this.movementsRepository.findById(id);
    const { idUser } = user;

    if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
      if (data.user_id !== idUser) {
        throw new BadRequestException(
          'You do not have access to this movement',
        );
      }
    }
    if (!data) {
      throw new BadRequestException('Movement not found');
    }
    return {
      ok: true,
      data: movementDto(data),
    };
  }

  async update(id: number, movement: UpdateMovement, user: AuthorizedUser) {
    //admin y moderador pueden actualizar cualquier movimiento
    //los demás roles solo pueden actualizar movimientos que pertenezcan a su usuario
    const movementExist = await this.movementsRepository.findById(id);
    const { idUser } = user;
    if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
      if (movementExist.user_id !== idUser) {
        throw new BadRequestException(
          'You do not have access to this movement',
        );
      }
    }

    if (!movementExist) {
      throw new BadRequestException('Movement not found');
    }

    const updateBody: UpdateMovement = {};
    if (movement.status) {
      updateBody.status = movement.status;
    }
    if (movement.description) {
      updateBody.description = movement.description;
    }
    if (movement.total) {
      updateBody.total = movement.total;
    }
    if (movement.category_id) {
      updateBody.category_id = movement.category_id;
    }

    const data = await this.movementsRepository.update(id, updateBody);

    return {
      ok: true,
      data: movementDto(data),
    };
  }
}
