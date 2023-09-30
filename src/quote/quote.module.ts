import {Module} from "@nestjs/common";
import {QuoteController} from "./quote.controller";
import {UserService} from "../user/user.service";
import {PrismaService} from "../../prisma/prisma.service";
import {QuoteService} from "./quote.service";
import {AuthModule} from "../auth/auth.module";

// @ts-ignore
@Module({
    controllers: [QuoteController],
    providers: [QuoteService, PrismaService]
})
export class QuoteModule{}