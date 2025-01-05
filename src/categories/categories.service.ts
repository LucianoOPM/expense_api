import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from '@/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/categories/dto/update-category.dto';
import { CategoryRepository } from '@/categories/categories.repository';
import {
  CreateCategory,
  UpdateCategory,
} from '@/categories/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(protected readonly categoriesRepository: CategoryRepository) {}

  async create(category: CreateCategoryDto) {
    try {
      const { name, description } = category;
      const insertBody: CreateCategory = {
        name,
        description,
      };

      const data = await this.categoriesRepository.create(insertBody);

      return {
        ok: true,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async findAll() {
    try {
      const data = await this.categoriesRepository.findAll();
      return {
        ok: true,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.categoriesRepository.findById(id);
      if (!data || !data.status) {
        throw new BadRequestException('Category not found');
      }
      return {
        ok: true,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async update(id: number, body: UpdateCategoryDto) {
    try {
      const category = await this.categoriesRepository.findById(id);
      if (!category || !category.status) {
        throw new BadRequestException('Category not found');
      }
      const updateBody: UpdateCategory = {};

      if (body.name) updateBody['name'] = body.name;
      if (body.description) updateBody['description'] = body.description;
      if (body.status) updateBody['status'] = body.status;

      const data = await this.categoriesRepository.update(id, updateBody);
      return {
        ok: true,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async remove(id: number) {
    try {
      const data = await this.categoriesRepository.findById(id);
      return {
        ok: true,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error en el servidor');
    }
  }
}
