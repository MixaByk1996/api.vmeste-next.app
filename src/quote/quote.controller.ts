import {Controller, Delete, Param} from "@nestjs/common";
// @ts-ignore
import {ApplicationService, QuoteService} from "./quote.service";

@Controller('/api/quote')
export class QuoteController{
    constructor(private quoteService: QuoteService) {
    }
    @Delete("/:id")
    async delete(@Param('id') id: string){

    }
}