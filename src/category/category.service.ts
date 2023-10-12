import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import { Prisma} from "@prisma/client";

@Injectable()
export class CategoryService{
    constructor(private prisma : PrismaService) {
    }

    async getCategoryById(id: string){
        return this.prisma.category.findFirst({
            where: {
                id : Number(id)
            }
        });
    }

    async createCategory(data : Prisma.CategoryCreateInput){
        return this.prisma.category.create({
            data : data
        })
    }
}