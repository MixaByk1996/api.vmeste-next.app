import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Category} from "@prisma/client";

@Injectable()
export class CategoryService{
    constructor(private prisma : PrismaService) {
    }

    async getCategoryById(id: string):Promise<Category>{
        return this.prisma.category.findFirst({
            where: {
                id : Number(id)
            }
        });
    }
}