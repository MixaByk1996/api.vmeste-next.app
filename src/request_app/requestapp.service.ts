import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class RequestappService{
    constructor(private readonly prismaService: PrismaService) {
    }

    // @ts-ignore
    async createRequest(data : Prisma.RequestAppCreateInput){
        return this.prismaService.requestApp.create({
            data
        });
    }
}