import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

// @ts-ignore
import { ApplicationService, QuoteService } from './quote.service';
import { Request, response, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as process from 'process';
import { jwtConstants } from '../auth/auth.constants';
import { CategoryService } from '../category/category.service';
import { ApiBody, ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateQuoteDto } from '../dtos/quote/create-quote.dto';
import { UpdateQuoteDto } from '../dtos/quote/update-quote.dto';
import { SerachQuoteDto } from '../dtos/quote/serach-quote.dto';
import { QuoteIdDto } from '../dtos/quote/quote-id.dto';

@Controller('/api/quote')
@ApiTags('Quotes')
export class QuoteController {
  constructor(
    private quoteService: QuoteService,
    private categoryService: CategoryService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Get('/')
  async getAll(@Req() request: Request) {
    const user = await request['user'];
    console.log('user', user)
    return this.quoteService.quotes(user.id);
  }
  @Post('/api/search')
  @ApiBody({ description: 'Метод поиска.', type: SerachQuoteDto })
  async search(@Body() searchQuoteDto: SerachQuoteDto) {
    return this.quoteService.getQuoteByNameOrDesc(searchQuoteDto.text);
  }
  @Get('/exit-from-quote')
  @ApiBody({ description: 'Выход из заявки' })
  @ApiQuery({ name: 'quote_id', description: 'Id заявки' })
  async exitFromQuote(@Query('quote_id') id: number, @Req() request: Request) {
    const user = request['user'];
    return this.quoteService.deleteUserByQuote({
      userId_quoteId: {
        userId: user.id,
        quoteId: id,
      },
    });
  }

  @Get('/get-details-quote')
  @ApiBody({ description: 'Детали заявки' })
  @ApiQuery({ name: 'id', description: 'Id заявки' })
  async getFirstQuote(@Query('id') id: string) {
    return (await this.quoteService.getDetailsQuote(id)) || [];
  }

  @Post('/add-current-user-to-quote')
  @ApiBody({
    description: 'Добавление пользователя в заявку',
    type: QuoteIdDto,
  })
  async addCurrentUserToQuote(
    @Req() request: Request,
    @Body() quoteDto: QuoteIdDto,
  ) {
    const user = request['user'];

    const quote = await this.quoteService.getQuoteById(quoteDto.quote_id);
    if (!quote) {
      throw new BadRequestException('Заявка не найдена!');
    }
    return this.quoteService.addUserToQuote({
      user: {
        connect: await this.userService.findUser({ id: user.id }),
      },
      quote: {
        connect: quote,
      },
    });
  }

  @Put('/update')
  @ApiQuery({ name: 'id', description: 'Id заявки' })
  @ApiBody({ description: 'Обновление заявки', type: UpdateQuoteDto })
  async updateQuote(
    @Query('id') id: string,
    @Body() updateDto: UpdateQuoteDto,
  ) {
    return this.quoteService.updateQuote({
      where: { id: Number(id) },
      data: {
        name: updateDto.name,
        realization_period: new Date(updateDto.realization_period),
        status: updateDto.status,
        tags: updateDto.tags,
        description: updateDto.description,
        photo_url: updateDto.photo,
        city_name: updateDto.city_name,
        min_amount: updateDto.min_amount,
        categoryId: updateDto.category_id
      },
    });
  }

  @Post('/create')
  @ApiBody({ description: 'Создание заявки', type: CreateQuoteDto })
  async createQuote(
    @Body() createuoteDto: CreateQuoteDto,
    @Req() request: Request,
  ) {
    const user = await request['user'];
    const category = await this.categoryService.getCategoryById(
      createuoteDto.category_id,
    );
    if (!category) {
      throw new BadRequestException('Category is not found!');
    }
    const name = createuoteDto.name;
    const status = createuoteDto.status;
    const tags = createuoteDto.tags;
    const photo_url = createuoteDto.photo;
    const description = createuoteDto.description;
    const city_name = createuoteDto.city_name;
    return this.quoteService.createQuote({
      name,
      realization_period: new Date(createuoteDto.realization_period),
      status,
      tags,
      description,
      photo_url,
      city_name,
      createrId: user.id,
      categoryId: category.id
    });
  }

  @Delete('/delete')
  @ApiQuery({ name: 'id', description: 'Id заявки' })
  async delete(@Query('id') id: string, @Req() request: Request) {
    try {
      const user = request['user'];
      const count = this.quoteService.getCountQuotesByCurrentUser(user.id);
      if (count) {
        return this.quoteService.deleteQuote({ id: Number(id) });
      } else {
        return { message: 'Не удален!' };
      }

      // return await this.userService.findUser({id: data['id']});
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
