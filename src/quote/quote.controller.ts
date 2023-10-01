import {Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException} from "@nestjs/common";
// @ts-ignore
import {ApplicationService, QuoteService} from "./quote.service";
import {Request, response, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";

@Controller('/api/quote')
export class QuoteController{
    constructor(private quoteService: QuoteService,
                private jwtService: JwtService,
                private userService: UserService) {
    }

    @Get('/')
    async getAll(){
        return this.quoteService.quotes();
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
        @Req() request : Request
    ){
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        if(!data){
            throw new UnauthorizedException();
        }
        const user = await this.userService.findUser({id: data['id']})
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