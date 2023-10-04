import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
// @ts-ignore
import {Prisma, Quote, Quote as QuoteModel} from '@prisma/client';

@Injectable()
export class QuoteService{
    constructor(private readonly prismaService: PrismaService) {}

    // @ts-ignore
    async getQuoteByUser(condition: any): Promise<QuoteModel[]> {
        return this.prismaService.quote.findMany({
            where: condition
        })
    }

    async getQuoteByNameOrDesc(value: string){
        return this.prismaService.quote.findMany({
            where: {
                OR :[
                    {name: {contains : value}},
                    {description: {contains : value}},
                ]
            }
        });
    }

    async createQuote(data: Prisma.QuoteCreateInput){
        return this.prismaService.quote.create({
             data,
            include:{
                 category : true
            }
         });
    }

    async getCountQuotesByCurrentUser(id: number){
        return this.prismaService.quote.count({
            where: {
                createrId: id
            }
        })
    }

    async deleteUserByQuote(
        where : Prisma.UsersOnQuotesWhereUniqueInput
    ){
        // @ts-ignore
        return this.prismaService.usersOnQuotes.delete({
           where
        })
    }

    async getDetailsQuote(id : string){
        return this.prismaService.quote.findFirst({
            where : {id : Number(id)},
            include: {
                users: true
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
    }):Promise<QuoteModel[]>  {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prismaService.quote.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include :{
                category : true
            }
        })
    }

    async deleteQuote(where: Prisma.QuoteWhereUniqueInput){
        return this.prismaService.quote.delete({
            where
        })
    }
}