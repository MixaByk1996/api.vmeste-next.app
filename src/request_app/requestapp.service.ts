import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequestappService {
  constructor(private readonly prismaService: PrismaService) {}

  // @ts-ignore
  async createRequest(data: Prisma.RequestAppCreateInput) {
    return this.prismaService.requestApp.create({
      data,
    });
  }

  async updateRequst(params: {
    where: Prisma.RequestAppWhereUniqueInput;
    data: Prisma.RequestAppUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.requestApp.update({
      data,
      where,
    });
  }

  async getAllRequest() {
    return this.prismaService.requestApp.findMany();
  }
  // async updateRequest(data : Prisma.RequestAppUpdateInput){
  //     return this.prismaService.requestApp.update({
  //         data
  //     })
  // }
}
