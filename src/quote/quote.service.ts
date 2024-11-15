import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// @ts-ignore
import { Prisma, Quote, Quote as QuoteModel } from '@prisma/client';

@Injectable()
export class QuoteService {
  constructor(private readonly prismaService: PrismaService) {}

  // @ts-ignore
  async getQuoteByUser(condition: any): Promise<QuoteModel[]> {
    return this.prismaService.quote.findMany({
      where: condition,
    });
  }
  async getMessagesByQuoteId(id: string) {
    return this.prismaService.quote.findFirst({
      select: {
        messages: true,
      },
      where: { id: parseInt(id) },
    });
  }
  async getQuoteByNameOrDesc(value: string) {
    return this.prismaService.quote.findMany({
      where: {
        OR: [
          { name: { contains: value } },
          { description: { contains: value } },
        ],
      },
    });
  }

  async createQuote(data: Prisma.QuoteUncheckedCreateInput) {
    return this.prismaService.quote.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async updateQuote(params: {
    where: Prisma.QuoteWhereUniqueInput;
    data: Prisma.QuoteUncheckedUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.quote.update({
      data,
      where,
    });
  }

  async getCountQuotesByCurrentUser(id: number) {
    return this.prismaService.quote.count({
      where: {
        createrId: id,
      },
    });
  }

  async deleteUserByQuote(where: Prisma.UsersOnQuotesWhereUniqueInput) {
    // @ts-ignore
    return this.prismaService.usersOnQuotes.delete({
      where,
    });
  }

  async addUserToQuote(data: Prisma.UsersOnQuotesCreateInput) {
    return this.prismaService.usersOnQuotes.create({
      data,
    });
  }

  async getDetailsQuote(id: string) {
    return this.prismaService.quote.findFirst({
      where: { id: Number(id) },
      include: {
        users: {
          include: {
            user: {
              select: {
                name: true,
                photo_url: true,
                createAt: true,
              },
            },
          },
        },
        messages: true,
      },
    });
  }

  async setAmountByQuote(data: Prisma.EventCreateInput) {
    return this.prismaService.event.create({
      data,
    });
  }

  async getQuoteById(id: string): Promise<Quote> {
    return this.prismaService.quote.findFirst({
      where: { id: Number(id) },
      include:{
        events: true,
        messages: true,
      }
    }) ;
  }
  async quotes(user_id: number) {
    return this.prismaService.quote.findMany({
      where: {
        createrId: user_id
      },
      include: {
        events: true,
        category: {
          include:{
            subcategories: true,
            requests: true
          }
        },
        messages: {
          include: {
            quiz: {
              include: {
                answers: {
                  include: {
                    _count: {
                      select: {
                        votes: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAllQuotes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuoteWhereUniqueInput;
    where?: Prisma.QuoteWhereInput;
    orderBy?: Prisma.QuoteOrderByWithRelationInput;
  }): Promise<QuoteModel[]> {
    return this.prismaService.quote.findMany({
      include: {
        category: true,
        messages: true,
        users: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                photo_url: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteQuote(where: Prisma.QuoteWhereUniqueInput) {
    return this.prismaService.quote.delete({
      where,
    });
  }
}
