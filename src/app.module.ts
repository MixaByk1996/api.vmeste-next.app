import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PrismaService} from "../prisma/prisma.service";
import {AuthController} from "./auth/auth.controller";
import {AuthModule} from "./auth/auth.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {CityModule} from "./city/city.module";
import {QuoteModule} from "./quote/quote.module";
import {RequestappModule} from "./request_app/requestapp.module";
import {MessageService} from "./message/message.service";
import {MessageModule} from "./message/message.module";

@Module({
  imports: [
      AuthModule,
      CityModule,
      QuoteModule,
      RequestappModule,
      MessageModule,
      MailerModule.forRoot({
        transport:{
          host: 'smtp.mail.ru',
          port: 465,
          secure: true,
          auth :{
            user : 'app.vmeste-mail@mail.ru',
            pass: 'kaswFhY6TAUS1HAc2PSP'
          },
          from: 'Test <app.vmeste-mail@mail.ru>'
        },
      })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
