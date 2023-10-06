import {Module} from "@nestjs/common";
import {MessageService} from "./message.service";
import {PrismaService} from "../../prisma/prisma.service";
import {QuoteService} from "../quote/quote.service";
import {MessageController} from "./message.controller";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";

@Module({
    providers: [MessageService, PrismaService, QuoteService, JwtService, UserService],
    controllers: [MessageController]
})
export class MessageModule{}