import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Res,
  HttpStatus,
  BadRequestException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import {
  QueryUserDto,
  CreateUserDto,
  SingleQueryDto,
  UpdateUserDto,
} from '@/users/dto/user.dto';
import { queryBuild } from '@/users/utils/query.builder';
import { Response } from 'express';
import { pageHandler } from '@/functions/pageHandler';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/role.guard';
import { Roles } from '@/secure/roles.decorator';
import { Role } from '@/interfaces/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() body: CreateUserDto, @Res() res: Response) {
    try {
      const { name, email, password } = body;
      const emailUser = await this.usersService.findByEmail(email);

      if (emailUser) {
        throw new BadRequestException('User already exists');
      }
      const user = await this.usersService.create({ email, name, password });
      res.status(HttpStatus.CREATED).json({
        ok: true,
        data: {
          idUser: user.id_user,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res
        .status(error.status)
        .json({ ok: false, error: { message: error.message } });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async findAll(@Query() query: QueryUserDto, @Res() res: Response) {
    try {
      const searchQuery = queryBuild(query);
      const { users, total } = await this.usersService.findAll(searchQuery);
      const pages = pageHandler(
        { limit: query.limit, page: query.page },
        total,
      );

      const resData = users.map((user) => {
        return {
          idUser: user.id_user,
          name: user.name,
          email: user.email,
        };
      });
      res.status(HttpStatus.OK).json({ ok: true, data: resData, pages });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ ok: false, error: { message: 'Error en el servidor' } });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() query: SingleQueryDto,
  ) {
    try {
      const queryObject = {};
      const positiveValues = ['true', '1'];
      const negativeValues = ['false', '0'];

      if (query.earnings) {
        if (positiveValues.includes(query.earnings)) {
          queryObject['earnings'] = true;
        } else if (negativeValues.includes(query.earnings)) {
          queryObject['earnings'] = false;
        }
      }

      if (query.expenses) {
        if (positiveValues.includes(query.expenses)) {
          queryObject['expenses'] = true;
        } else if (negativeValues.includes(query.expenses)) {
          queryObject['expenses'] = false;
        }
      }

      const user = await this.usersService.findOne(+id);

      if (!user) {
        throw new BadRequestException('User not found');
      }
      res.status(HttpStatus.OK).json({
        ok: true,
        data: {
          idUser: user.id_user,
          name: user.name,
          email: user.email,
          earnings: user.earnings,
          expenses: user.expenses,
        },
      });
    } catch (error) {
      res.status(error.status).json({ ok: false, error: { message: error } });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const { estatus } = body;
      const user = await this.usersService.findOne(+id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const updatedUser = await this.usersService.update(+id, { estatus });
      res.status(HttpStatus.OK).json({
        ok: true,
        data: {
          idUser: updatedUser.id_user,
          name: updatedUser.name,
          email: updatedUser.email,
          estatus: updatedUser.is_active,
          earnings: updatedUser.earnings,
          expenses: updatedUser.expenses,
        },
      });
    } catch (error) {
      res.status(error.status).json({ ok: false, error: { message: error } });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const { name, password, role } = body;
      const user = await this.usersService.findOne(+id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const updatedUser = await this.usersService.update(+id, {
        name,
        password,
        role,
      });
      res.status(HttpStatus.OK).json({
        ok: true,
        data: {
          idUser: updatedUser.id_user,
          name: updatedUser.name,
          email: updatedUser.email,
          estatus: updatedUser.is_active,
          role: updatedUser.role,
          earnings: updatedUser.earnings,
          expenses: updatedUser.expenses,
        },
      });
    } catch (error) {
      res.status(error.status).json({ ok: false, error: { message: error } });
    }
  }
}
