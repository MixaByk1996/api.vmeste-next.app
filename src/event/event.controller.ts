import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { QuoteService } from '../quote/quote.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from '../dtos/event/create-event.dto';

@Controller('/api/event')
@ApiTags('Event')
export class EventController {
  // @ts-ignore
  constructor(
    private eventService: EventService,
    private quoteService: QuoteService,
  ) {}

  @Post('/create')
  @ApiBody({description: "Добавление события в заявку", type : CreateEventDto})
  async createEventByQuote(
      @Body() createEventDto : CreateEventDto
  ){
    const name = createEventDto.name;
    let quote = await this.quoteService.getQuoteById(createEventDto.quote_id);
    if(!quote){
      throw new BadRequestException("Заявка не найдена!");
    }

    return this.eventService.setAmountByQuote({
      name,
      quote :{
        connect: quote
      }
    })
  }
}
