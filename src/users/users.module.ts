import { Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { PrismaService } from '@/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@/users/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService],
  imports: [ConfigModule],
  exports: [UserRepository],
})
export class UsersModule {}
