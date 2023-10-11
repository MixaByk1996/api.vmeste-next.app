import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Prisma} from "@prisma/client";
import {QuoteService} from "../quote/quote.service";

@Injectable()
export class EventService{
    constructor(private prismaService : PrismaService, private quoteService : QuoteService) {
    }

    async setAmountByQuote(data : Prisma.EventCreateInput){
        return this.prismaService.event.create({
            data
        });
    }
}