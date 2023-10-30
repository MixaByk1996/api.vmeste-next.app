import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventController } from './event.controller';
import { QuoteService } from '../quote/quote.service';

@Module({
  providers: [EventService, PrismaService, QuoteService],
  controllers: [EventController],
})
export class EventModule {}
