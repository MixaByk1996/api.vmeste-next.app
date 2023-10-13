import {ApiProperty} from "@nestjs/swagger";

export class CreateTextMessageDto{
    @ApiProperty({
        description: "Текст сообщения"
    })
    text : string;
    @ApiProperty({
        description: "Id заявки"
    })
    quote_id : string;
}