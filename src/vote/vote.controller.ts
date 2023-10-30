import { Body, Controller, Post, Req } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateVoteDto } from '../dtos/vote/create-vote.dto';

@Controller('/api/vote')
@ApiTags('Votes')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Post('/create')
  @ApiBody({ description: 'Создание голоса', type: CreateVoteDto })
  async createVote(
    @Body() createVoteDto: CreateVoteDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    return this.voteService.createVote(createVoteDto.answer_id, user.id);
  }
}
