import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(private prismaService: PrismaService) {}

  async createVote(answerId: string, userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    const answer = await this.prismaService.answer.findFirst({
      where: {
        id: Number(answerId),
      },
    });
    // @ts-ignore
    return this.prismaService.vote.create({
      data: {
        answer: {
          connect: answer,
        },
        user: {
          connect: user,
        },
      },
    });
  }
}
