import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { EventsGateway } from './events/events.gateway';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {PaymentUrl} from "./other/payment_url";

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this.toString());
  };
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser('secret'));
  // @ts-ignore
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  });

  PaymentUrl.url = 'https://stage.tochka.com/api/v1/cyclops/v2/jsonrpc'
  PaymentUrl.beneficiary_id = ''
  const config = new DocumentBuilder()
    .setTitle('Documentation')
    .setDescription('Описание API Backend части')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  await app.listen(8000);
  const eg = app.get(EventsGateway);
  setInterval(() => eg.getMessages(), 1000);
}
bootstrap();
