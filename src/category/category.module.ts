import {Module} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {PrismaService} from "../../prisma/prisma.service";
import {CategoryController} from "./category.controller";
import {RequestappModule} from "../request_app/requestapp.module";

@Module({
    controllers: [CategoryController],
    providers:[CategoryService, PrismaService]
})
export class CategoryModule{}