import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from '@/categories/categories.repository';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoriesModule {}
