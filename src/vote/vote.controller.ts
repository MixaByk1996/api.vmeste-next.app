import {Body, Controller, Post, Req} from "@nestjs/common";
import {VoteService} from "./vote.service";
import {ApiTags} from "@nestjs/swagger";

@Controller('/api/vote')
@ApiTags('Votes')
export class VoteController{
    constructor(
        private voteService : VoteService
    ) {}

    @Post('/create')
    async createVote(
        @Body('answer_id') answer_id : string,
        @Req() request : Request
    ){
        const user = request['user'];
        return this.voteService.createVote(answer_id, user.id);
    }
}