import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";
import { EventsGateway } from './events/events.gateway';
import {request} from "express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as path from "path";
import process from "process";
async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this.toString());
  };
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser('secret'));
  app.enableCors();
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true
  // })
  const config = new DocumentBuilder()
      .setTitle('Documentation')
      .setDescription('Описание API Backend асти')
      .setVersion('1.0')
      .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3000);
  const eg = app.get(EventsGateway);
  setInterval(() => eg.getMessages(), 1000);


}
bootstrap();
