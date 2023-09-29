import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PrismaService} from "../prisma/prisma.service";
import {AuthController} from "./auth/auth.controller";
import {AuthModule} from "./auth/auth.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {CityModule} from "./city/city.module";
import {ApplicationModule} from "./application/application.module";

@Module({
  imports: [
      AuthModule,
      CityModule,
      ApplicationModule,
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
  providers: [AppService],
})
export class AppModule {}
