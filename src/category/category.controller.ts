import {Body, Controller, Post, Req} from "@nestjs/common";
import {CategoryService} from "./category.service";

@Controller("/api/category")
export class CategoryController{
    constructor(private categoryService : CategoryService) {
    }

    @Post('/create')
    async createCategory(@Body('name') name : string, @Req() request : Request){
        return this.categoryService.createCategory({
            name
        })
    }
}