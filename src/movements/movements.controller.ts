import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/role.guard';
import { User } from '@/decorators/user.decorators';
import { AuthorizedUser } from '@/auth/entities/auth.entity';
import { IncomingQuery } from './entities/movement.entity';

@Controller('movements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  async create(@Body() body: CreateMovementDto, @User() user: AuthorizedUser) {
    const { idCategory, description, total, createdAt } = body;
    const { idUser } = user;

    return await this.movementsService.create({
      user_id: idUser,
      category_id: idCategory,
      description,
      total,
      created_at: new Date(createdAt) ?? undefined,
    });
  }

  @Get()
  findAll(@User() user: AuthorizedUser, @Query() query: IncomingQuery) {
    return this.movementsService.findAll(user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: AuthorizedUser) {
    return this.movementsService.findOne(+id, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateMovementDto,
    @User() user: AuthorizedUser,
  ) {
    return this.movementsService.update(+id, body, user);
  }

  @Patch(':id')
  status(
    @Param('id') id: string,
    @Body() body: UpdateMovementDto,
    @User() user: AuthorizedUser,
  ) {
    return this.movementsService.update(+id, body, user);
  }
}
