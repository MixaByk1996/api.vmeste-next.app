import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class QuoteService{
    constructor(private readonly prisma: PrismaService) {}

    // @ts-ignore
    async getQuoteByUser(condition: any) {

    }
}