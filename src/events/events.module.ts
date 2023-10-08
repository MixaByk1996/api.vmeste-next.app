import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import {QuoteService} from "../quote/quote.service";
import {PrismaService} from "../../prisma/prisma.service";
import {QuoteModule} from "../quote/quote.module";

@Module({
  imports: [QuoteModule],
  providers: [EventsGateway, QuoteService,PrismaService]
})
export class EventsModule {}
