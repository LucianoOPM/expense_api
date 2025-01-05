import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { MovementsRepository } from './movements.repository';
import { PrismaService } from '@/prisma.service';
import { UsersModule } from '@/users/users.module';
import { CategoriesModule } from '@/categories/categories.module';

@Module({
  imports: [UsersModule, CategoriesModule],
  controllers: [MovementsController],
  providers: [MovementsService, MovementsRepository, PrismaService],
})
export class MovementsModule {}
