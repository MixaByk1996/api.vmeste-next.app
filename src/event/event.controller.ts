import {Body, Controller, Post} from "@nestjs/common";
import {EventService} from "./event.service";
import {QuoteService} from "../quote/quote.service";

@Controller('/api/event')
export class EventController{
    // @ts-ignore
    constructor(
        private eventService : EventService,
        private quoteService : QuoteService
    ) {
    }

    @Post('/create')
    async createEventByQuote(
        @Body('name') name : string,
        @Body('quote_id') quote_id : string
    ){
        const quote = await this.quoteService.getQuoteById(quote_id);
        return this.eventService.setAmountByQuote({
            name,
            quote:{
                connect : quote
            }
        })
    }
}