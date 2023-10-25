import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {CreateCategoryDto} from "../dtos/category/create-category.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller("/category")
@ApiTags('Category')
export class CategoryController{
    constructor(private categoryService : CategoryService) {
    }

    @Post('/create')
    async createCategory(@Body() createCategoryDto : CreateCategoryDto, @Req() request : Request){
        return this.categoryService.createCategory(createCategoryDto)
    }

    @Get('/')
    @ApiResponse({status : 200, description : "Список всех категорий"})
    async getAllCategories(){
        return this.categoryService.getAllCategories();
    }


}