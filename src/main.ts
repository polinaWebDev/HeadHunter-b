import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata"
import { join } from 'path';
import * as express from 'express';
import * as process from "node:process";
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as fs from "node:fs";
import * as path from "node:path";
import {NestExpressApplication} from "@nestjs/platform-express";



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*', // или указывается конкретный домен 'http://localhost:4000'
    methods: ['GET', 'POST'], // Методы
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Игнорирует поля, которых нет в DTO
    forbidNonWhitelisted: true, // Ошибка, если есть лишние поля
    transform: true, // Автоматически преобразует типы данных
  }));

  const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('http://localhost:3000')
      .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Сохраняем `openapi.json` в `public/`
  fs.writeFileSync('public/openapi.json', JSON.stringify(document, null, 2));


  // Делаем файл доступным по URL
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
