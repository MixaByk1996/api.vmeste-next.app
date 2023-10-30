import {Body, Controller, Get, Post, Query, Req} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {CreateCategoryDto} from "../dtos/category/create-category.dto";
import {ApiBody, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {LoginUserDto} from "../dtos/users/login-user.dto";
import {QuoteService} from "../quote/quote.service";

@Controller("/category")
@ApiTags('Category')
export class CategoryController{
    constructor(private categoryService : CategoryService, private quoteService : QuoteService) {
    }

    @Get('/get-quotes-by-category')
    @ApiBody({description: 'Список заявок по категории'})
    @ApiQuery({name : 'id', description : 'Id категории'})
    async getQuotes(@Query('id') id: string){
        //const category = this.categoryService.getCategoryById(id);
        return this.quoteService.getAllQuotes({
            where:{
                category : {
                    id : Number(id)
                }
            }
        })
    }

    @Post('/create')
    @ApiBody({description: "Создание категории",type : CreateCategoryDto})
    async createCategory(@Body() createCategoryDto : CreateCategoryDto, @Req() request : Request){
        return this.categoryService.createCategory(createCategoryDto)
    }

    @Get('/')
    @ApiBody({description: "Список категорий"})
    @ApiResponse({status : 200, description : "Список всех категорий"})
    async getAllCategories(){
        return this.categoryService.getAllCategories();
    }


}