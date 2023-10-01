import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
// @ts-ignore
import {Prisma, Quote as QuoteModel} from '@prisma/client';

@Injectable()
export class QuoteService{
    constructor(private readonly prismaService: PrismaService) {}

    // @ts-ignore
    async getQuoteByUser(condition: any): Promise<QuoteModel[]> {
        return this.prismaService.quote.findMany({
            where: condition
        })
    }

    async createQuote(data: Prisma.QuoteCreateInput){
        return this.prismaService.quote.create({
             data,
         });
    }

    async getCountQuotesByCurrentUser(id: number){
        return this.prismaService.quote.count({
            where: {
                createrId: id
            }
        })
    }

    async quotes(){
        return this.prismaService.quote.findMany();
    }

    async getAllQuotes(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.QuoteWhereUniqueInput;
        where?: Prisma.QuoteWhereInput;
        orderBy?: Prisma.QuoteOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prismaService.quote.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        })
    }

    async deleteQuote(where: Prisma.QuoteWhereUniqueInput){
        return this.prismaService.quote.delete({
            where
        })
    }
}