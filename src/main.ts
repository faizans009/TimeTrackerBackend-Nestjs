/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ValidationInterceptor } from './helpers/interceptors/validation-exception.interceptor';
import { useContainer } from 'class-validator';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
import 'dotenv/config'



async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const swaggerConfiguration = new DocumentBuilder()
    .setTitle('TimeTracker Api')
    .setDescription('TimeTracker Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfiguration);
  SwaggerModule.setup('api/swagger', app, document);

  console.log(join(__dirname, '..', '../public/uploads'))
  app
    .useGlobalPipes(new ValidationPipe())
    .useGlobalInterceptors(new ValidationInterceptor())
    .use(bodyParser.json({ limit: '20mb' }))
    .use('/public', express.static(join(__dirname, '..', '..', '/public')))
    .listen(process.env.PORT, () =>
      Logger.log('Listening at http://localhost:' + process.env.PORT),
    );
}
bootstrap();
