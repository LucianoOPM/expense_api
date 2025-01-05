import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  Category,
  CreateCategory,
  ICategoryRepository,
  UpdateCategory,
} from './entities/category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  private readonly categories: PrismaService['categories'];
  constructor(protected readonly prismaService: PrismaService) {
    this.categories = prismaService.categories;
  }
  async findById(idCategory: number) {
    return await this.categories.findUnique({
      where: { id_category: idCategory },
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.categories.findMany();
  }

  async create(data: CreateCategory): Promise<Category> {
    return await this.categories.create({ data });
  }

  async update(id: number, data: UpdateCategory): Promise<Category> {
    return await this.categories.update({
      where: { id_category: id },
      data,
    });
  }
}
