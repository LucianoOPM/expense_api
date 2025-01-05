import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { MovementsModule } from './movements/movements.module';
import { CategoriesModule } from './categories/categories.module';
import config from '@/config/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    MovementsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
