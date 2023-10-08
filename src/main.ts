import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";
import {EventsGateway} from "./events/events.gateway";
import {request} from "express";

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this.toString());
  };
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser('secret'));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })
  await app.listen(3000);
  const eg = app.get(EventsGateway);
  setInterval(() => eg.getMessages(), 1000);
}
bootstrap();
