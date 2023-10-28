import {ApiProperty} from "@nestjs/swagger";

export class QuoteIdDto{
    @ApiProperty({
        description : "Поиск по строке"
    })
    quote_id : string;
}