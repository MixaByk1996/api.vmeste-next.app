import {Controller} from "@nestjs/common";
import {QuoteService} from "../quote/quote.service";
import {PusherChannel, PusherEvent} from "nestjs-pusher";

@Controller('messages')
export class PusherController{
    constructor(private quoteService : QuoteService) {
    }

    @PusherChannel('get-messages')
    @PusherEvent('message.all')
    async getMessages(){
        return this.quoteService.quotes();
    }

}