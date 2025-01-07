import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from '@/auth/guards/role.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Public } from '@/decorators/metaData';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/interfaces/role.enum';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MODERATOR)
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Get()
  @Public()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  updateStatus(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(+id, body);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(+id, body);
  }
}
