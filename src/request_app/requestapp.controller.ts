import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RequestappService } from './requestapp.service';
import { CategoryService } from '../category/category.service';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReqAppCreateDto } from '../dtos/requestapp/req-app.create.dto';
import { ReqAppUpdateDto } from '../dtos/requestapp/req-app.update.dto';

@Controller('/api/request-app/')
@ApiTags('RequestApp')
export class RequestappController {
  constructor(
    private requestappService: RequestappService,
    private categoryService: CategoryService,
  ) {}

  @Get('/')
  @ApiOkResponse({ status: 200, description: 'Список запросов' })
  async getAllRequest() {
    return this.requestappService.getAllRequest();
  }

  @Post('/create')
  @ApiBody({ description: 'Создание запроса', type: ReqAppCreateDto })
  async createReq(@Body() reqAppDto: ReqAppCreateDto) {
    const category = await this.categoryService.getCategoryById(
      reqAppDto.category_id,
    );
    if (!category) {
      throw new BadRequestException('Категория не найдена!');
    }
    const city = reqAppDto.city;
    const name = reqAppDto.name;
    const countProducts = reqAppDto.count_products;
    return this.requestappService.createRequest({
      name,
      countProducts: parseInt(countProducts),
      city,
      receiptPeriod: new Date(reqAppDto.receipt_period),
      category: {
        connect: category,
      },
    });
  }
  @Put('/update')
  @ApiBody({ description: 'Обновление запроса', type: ReqAppUpdateDto })
  @ApiQuery({ name: 'id', description: 'Id запроса' })
  async updateReqApp(
    @Query('id') id: string,
    @Body() updateReq: ReqAppUpdateDto,
  ) {
    const category = await this.categoryService.getCategoryById(
      updateReq.category_id,
    );
    if (!category) {
      throw new BadRequestException('Категория не найдена!');
    }
    return this.requestappService.updateRequst({
      where: { id: Number(id) },
      data: {
        name: updateReq.name,
        countProducts: parseInt(updateReq.count_products),
        city: updateReq.city,
        receiptPeriod: new Date(updateReq.receipt_period),
        category: {
          connect: category,
        },
      },
    });
  }
}
