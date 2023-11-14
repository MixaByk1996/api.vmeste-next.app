import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCategoryDto } from '../dtos/category/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategoryById(id: string) {
    return this.prisma.category.findFirst({
      where: {
        id: Number(id),
      },
    });
  }

  async createCategory(createCategory: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategory,
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      include:{
        subcategories : true
      }
    });
  }
}
