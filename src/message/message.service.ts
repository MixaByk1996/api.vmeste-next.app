import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class MessageService{
    constructor(private prismaService : PrismaService) {}

    async createMessage(data : Prisma.MessageCreateInput){
        return this.prismaService.message.create({
            data
        });
    }

    async deleteMessage(id){
        return this.prismaService.message.delete({
            where : {id : Number(id)}
        })
    }

}