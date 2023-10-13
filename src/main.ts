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
  // {
  //   origin: 'http://localhost:3000',
  //       credentials: true
  // }
  const config = new DocumentBuilder()
      .setTitle('Documentation')
      .setDescription('Описание API Backend асти')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document,{
    swaggerOptions: {
      customJs:
          "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.0.0/swagger-ui-bundle.js",
    },
    customSiteTitle: 'Backend Generator',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
  await app.listen(3000);
  const eg = app.get(EventsGateway);
  setInterval(() => eg.getMessages(), 1000);


}
bootstrap();
