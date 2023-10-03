import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";

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
}
bootstrap();
