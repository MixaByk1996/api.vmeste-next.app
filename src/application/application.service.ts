import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Prisma} from "@prisma/client";



@Injectable()
export class ApplicationService{
    constructor(private prisma: PrismaService) {}


}