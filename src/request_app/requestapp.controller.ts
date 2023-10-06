import {Body, Controller, Post} from "@nestjs/common";
import {RequestappService} from "./requestapp.service";
import {CategoryService} from "../category/category.service";

@Controller("/api/request-app/")
export class RequestappController{
    constructor(
        private requestappService : RequestappService,
        private categoryService : CategoryService
    ) {}

    @Post('/')
    async createReq(
        @Body('name') name : string,
        @Body('count_products') countProducts : string,
        @Body('city') city : string,
        @Body('receipt_period') receiptPeriod : string,
        @Body('country') country : string,
        @Body('category_id') category_id : string
    ){
        const category = await this.categoryService.getCategoryById(category_id);
        return this.requestappService.createRequest({
            name,
            countProducts : parseInt(countProducts),
            city,
            receiptPeriod: new Date(receiptPeriod),
            category : {
                connect : category
            }
        })
    }
}