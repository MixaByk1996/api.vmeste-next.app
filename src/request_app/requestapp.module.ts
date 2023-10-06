import {Module} from "@nestjs/common";
import {RequestappController} from "./requestapp.controller";
import {PrismaService} from "../../prisma/prisma.service";
import {RequestappService} from "./requestapp.service";
import {CategoryService} from "../category/category.service";
import {JwtService} from "@nestjs/jwt";

@Module({
    providers: [RequestappService, PrismaService, CategoryService, JwtService],
    controllers: [RequestappController]
})
export class RequestappModule{}