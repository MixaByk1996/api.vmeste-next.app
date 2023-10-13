import {BadRequestException, Body, Controller, Get, Post} from "@nestjs/common";
import {RequestappService} from "./requestapp.service";
import {CategoryService} from "../category/category.service";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {ReqAppCreateDto} from "../dtos/requestapp/req-app.create.dto";

@Controller("/api/request-app/")
@ApiTags('ReqestApp')
export class RequestappController{
    constructor(
        private requestappService : RequestappService,
        private categoryService : CategoryService
    ) {}

    @Get('/')
    @ApiOkResponse({status: 200, description : 'Список запросов'})
    async getAllRequest(){
        return this.requestappService.getAllRequest();
    }

    @Post('/create')
    async createReq(
        @Body() reqAppDto : ReqAppCreateDto
    ){
        const category = await this.categoryService.getCategoryById(reqAppDto.category_id);
        if(!category){
            throw new BadRequestException("Category is not found!");
        }
        const city = reqAppDto.city;
        const name = reqAppDto.name;
        const countProducts = reqAppDto.count_products;
        return this.requestappService.createRequest({
            name,
            countProducts : parseInt(countProducts),
            city,
            receiptPeriod: new Date(reqAppDto.receipt_period),
            category : {
                connect : category
            }
        })
    }
}