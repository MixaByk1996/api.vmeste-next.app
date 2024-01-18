import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { QuoteService } from '../quote/quote.service';
import { PrismaService } from '../../prisma/prisma.service';
import { QuoteModule } from '../quote/quote.module';
import {RequestappService} from "../request_app/requestapp.service";

@Module({
  imports: [QuoteModule],
  providers: [EventsGateway, RequestappService, QuoteService, PrismaService],
})
export class EventsModule {}
