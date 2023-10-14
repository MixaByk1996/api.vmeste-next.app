import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";
import { EventsGateway } from './events/events.gateway';
import {request} from "express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { resolve } from 'path';
import { writeFileSync, createWriteStream } from 'fs';
import { get } from 'https';
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
  SwaggerModule.setup('swagger', app, document);
  const serverUrl = "https://api-vmeste-next-app.vercel.app"
  get(
      `${serverUrl}/swagger/swagger-ui-bundle.js`, function
      (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
        console.log(
            `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
        );
      });
  get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
    );
  });

  get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
            createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
            `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      });

  get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
    );
  });
  await app.listen(3000);
  const eg = app.get(EventsGateway);
  setInterval(() => eg.getMessages(), 1000);


}
bootstrap();
