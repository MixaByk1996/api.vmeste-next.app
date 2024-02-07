import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QuoteService } from '../quote/quote.service';

@Injectable()
export class EventService {
  constructor(
    private prismaService: PrismaService,
    private quoteService: QuoteService,
  ) {}

  async setAmountByQuote(data: {
      quote: {
          connect: Prisma.Prisma__QuoteClient<GetResult<Prisma.$QuotePayload<DefaultArgs>, {
              include: { events: boolean };
              where: { id: number }
          }, "findFirst"> | null, null, DefaultArgs>
      };
      name: string
  }) {
    return this.prismaService.event.create({
      data,
    });
  }
}
