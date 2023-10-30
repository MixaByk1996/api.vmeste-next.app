import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { PrismaService } from '../../prisma/prisma.service';
import { VoteController } from './vote.controller';

@Module({
  controllers: [VoteController],
  providers: [VoteService, PrismaService],
})
export class VoteModule {}
