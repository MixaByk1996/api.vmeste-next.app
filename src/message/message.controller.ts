import {Body, Controller, Get, Param, Post, Req, UnauthorizedException} from "@nestjs/common";
import {MessageService} from "./message.service";
import {QuoteService} from "../quote/quote.service";
import {jwtConstants} from "../auth/auth.constants";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {Request} from "express";

@Controller("/api/message")
export class MessageController{
    constructor(
        private messageSerice: MessageService,
        private quoteService: QuoteService,
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    @Get('/get-messages/:id')
    async getMessages(@Param('id') id : string){
        return this.quoteService.getQuoteById(id);
    }

    @Post('/create')
    async createMessage(
        @Body('text') text : string,
        @Body('quote_id') quote_id : string,
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
        const user = await this.userService.findUser({id: data['id']});
        const quote = await this.quoteService.getQuoteById(quote_id);
        return this.messageSerice.createMessage({
            text,
            creater:{
                connect : user
            },
            quote:{
                connect: quote
            }
        })
    }
}