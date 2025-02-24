import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs';
import { authMiddleware } from './Auth/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.use(authMiddleware);


  app.enableCors({
    origin: 'http://localhost:3000',
    methods: "*",
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      description: 'JWT access в куках',
      name: 'accessToken',
      type: 'apiKey',
      in: 'cookie',
    })
    .addCookieAuth('refreshToken', {
      description: 'JWT refresh токен в куках',
      name: 'refreshToken',
      type: 'apiKey',
      in: 'cookie',
    })
    .addServer('http://localhost:3002')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets('uploads', { prefix: '/uploads' })

  fs.writeFileSync('public/openapi.json', JSON.stringify(document, null, 2));

  await app.listen(process.env.PORT || 3002);

}
bootstrap();
