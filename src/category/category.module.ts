import {Module} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {PrismaService} from "../../prisma/prisma.service";
import {CategoryController} from "./category.controller";
import {RequestappModule} from "../request_app/requestapp.module";
import {QuoteService} from "../quote/quote.service";

@Module({
    controllers: [CategoryController],
    providers:[CategoryService, PrismaService, QuoteService]
})
export class CategoryModule{}