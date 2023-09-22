import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";

// @ts-ignore
@Injectable
export class UserService {
    constructor(private prisma: PrismaService) {
    }

}

