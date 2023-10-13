import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    UnauthorizedException
} from "@nestjs/common";
// @ts-ignore
import {ApplicationService, QuoteService} from "./quote.service";
import {Request, response, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import * as process from "process";
import {jwtConstants} from "../auth/auth.constants";
import {CategoryService} from "../category/category.service";
import {ApiTags} from "@nestjs/swagger";

@Controller('/api/quote')
@ApiTags('Quotes')
export class QuoteController{
    constructor(private quoteService: QuoteService,
                private categoryService: CategoryService,
                private jwtService: JwtService,
                private userService: UserService) {
    }

    @Get('/')
    async getAll(){
        return this.quoteService.quotes();
    }
    @Post('/api/search')
    async search(@Body('text') text : string){
        return this.quoteService.getQuoteByNameOrDesc(text);
    }
    @Get('/exit-from-quote')
    async exitFromQuote(@Query('id_quote') id : number, @Req() request : Request){
        const user = request['user'];
        return this.quoteService.deleteUserByQuote({
            userId_quoteId: {
                userId : user.id,
                quoteId: id
            }
        })
    }

    @Get('/get-details-quote')
    async getFirstQuote(@Query('id') id : string){
        return await this.quoteService.getDetailsQuote(id) || [];
    }

    @Get('/get-quotes-by-category')
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

    @Post('/add-current-user-to-quote')
    async addCurrentUserToQuote(
        @Body('quote_id') quote_id : string,
        @Req() request : Request
    ){
        const user = request['user'];

        const quote = await this.quoteService.getQuoteById(quote_id);
        if(!quote){
            throw new BadRequestException("Quote is not found!");
        }
        return this.quoteService.addUserToQuote({
            user: {
                connect : await this.userService.findUser({id : user.id})
            },
            quote:{
                connect : quote
            }
        })
    }

    @Post('/create')
    async createQuote(
        @Body('name') name : string,
        @Body('realization_period') realization_period : string,
        @Body('status') status : string,
        @Body('tags') tags : string,
        @Body('description') description : string,
        @Body('photo_url') photo_url : string,
        @Body('city_name') city_name : string,
        @Body('category_id') category_id:string,
        @Req() request : Request
    ){
        const user = request['user'];
        const category = await this.categoryService.getCategoryById(category_id);
        if(!category){
            throw new BadRequestException("Category is not found!");
        }
        return this.quoteService.createQuote({
            name,
            realization_period: new Date(realization_period),
            status,
            tags,
            description,
            photo_url,
            city_name,
            creater:{
                connect: await this.userService.findUser({id: user.id})
            },
            category:{
                connect: category
            }
        })

    }

    @Delete("/delete")
    async delete(@Query('id') id: string, @Req() request: Request){
        try{
            const user = request['user'];
            const count = this.quoteService.getCountQuotesByCurrentUser(user.id);
            if(count){
                return this.quoteService.deleteQuote({id: Number(id)});
            }
            else{
                return {message : "Quote is not deleted!"};
            }

            // return await this.userService.findUser({id: data['id']});
        }catch (e){
            throw new UnauthorizedException();
        }

    }
}