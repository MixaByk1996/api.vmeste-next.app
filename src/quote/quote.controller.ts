import {Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException} from "@nestjs/common";
// @ts-ignore
import {ApplicationService, QuoteService} from "./quote.service";
import {Request, response, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import * as process from "process";
import {jwtConstants} from "../auth/auth.constants";
import {CategoryService} from "../category/category.service";

@Controller('/api/quote')
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



    @Get('/get-details-quote/:id')
    async getFirstQuote(@Param('id') id : string){
        return await this.quoteService.getDetailsQuote(id) || [];
    }

    @Get('/get-quotes-by-category/:id')
    async getQuotes(@Param('id') id: string){
        //const category = this.categoryService.getCategoryById(id);
        return this.quoteService.getAllQuotes({
            where:{
                category : {
                    id : Number(id)
                }
            }
        })
    }

    @Post('/')
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
        const cookie = request.cookies['jwt'];
        if(!cookie){
            throw new UnauthorizedException();
        }
        const data = await this.jwtService.verifyAsync(cookie,{
            secret: jwtConstants.secret
        });
        if(!data){
            throw new UnauthorizedException();
        }
        const user = await this.userService.findUser({id: data['id']})
        const category = await this.categoryService.getCategoryById(category_id)
        return this.quoteService.createQuote({
            name,
            realization_period: new Date(realization_period),
            status,
            tags,
            description,
            photo_url,
            city_name,
            creater: {
                connect : user
            },
            category:{
                connect: category
            }
        })

    }

    @Delete("/:id")
    async delete(@Param('id') id: string, @Req() request: Request){
        try{
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if(!data){
                throw new UnauthorizedException();
            }
            const user = await this.userService.findUser({id: data['id']})

            const count = this.quoteService.getCountQuotesByCurrentUser(user.id);
            if(count){
                return this.quoteService.deleteQuote({id: Number(id)});
            }
            else{
                return {message : "Заявка не удалена"};
            }

            // return await this.userService.findUser({id: data['id']});
        }catch (e){
            throw new UnauthorizedException();
        }

    }
}