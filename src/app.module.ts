import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from "./auth/auth.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {CityModule} from "./city/city.module";
import {QuoteModule} from "./quote/quote.module";
import {RequestappModule} from "./request_app/requestapp.module";
import {MessageModule} from "./message/message.module";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {UserService} from "./user/user.service";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma/prisma.service";

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
  providers: [AppService, UserService, JwtService, PrismaService]
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({path: '/api/*', method : RequestMethod.ALL});
    }
}
