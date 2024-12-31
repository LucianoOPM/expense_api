import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port') as number;
  const nextJs = configService.get('nextJs') as string;
  const astroJs = configService.get('astroJs') as string;

  // 1. Primero el cookie parser
  app.use(cookieParser());

  app.enableCors({
    origin: [nextJs, astroJs],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
  });

  // 3. Finalmente, otras configuraciones globales
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
