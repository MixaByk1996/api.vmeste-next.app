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
import {CategoryModule} from "./category/category.module";
import { EventsModule } from './events/events.module';
import {SwaggerModule} from "@nestjs/swagger";
import {EventModule} from "./event/event.module";
import {VoteService} from "./vote/vote.service";
import {VoteModule} from "./vote/vote.module";
import {PusherModule} from "nestjs-pusher";
import Pusher from "pusher";
import {PusherController} from "./pusher/pusher.controller";
import {QuoteService} from "./quote/quote.service";

const yourPusherOptions = {
    key: 'd81476718b238eafe6ef',
    appId: '1686326',
    secret: '7c7bbb076906bd44e52a',
}

const chunkingOptions = {
    limit: 40000, //4mb
    enabled: true
}

@Module({
  imports: [
      AuthModule,
      CityModule,
      QuoteModule,
      RequestappModule,
      MessageModule,
      CategoryModule,
      EventModule,
      VoteModule,
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
      }),
      PusherModule.forRoot(
          <Pusher.Options>yourPusherOptions,
          chunkingOptions,
          true
      ),
      SwaggerModule
  ],
  controllers: [AppController, PusherController],
  providers: [AppService, UserService, JwtService, PrismaService, QuoteService]
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({path: '/api/*', method : RequestMethod.ALL});
    }
}
