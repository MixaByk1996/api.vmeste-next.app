import {ApiProperty} from "@nestjs/swagger";

export class CreateVoteDto{
    @ApiProperty({
        description: "Id варианта ответа"
    })
    answer_id : string;
}