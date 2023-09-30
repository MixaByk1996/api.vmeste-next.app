import {Controller, Delete, Get, Param, Req, UnauthorizedException} from "@nestjs/common";
// @ts-ignore
import {ApplicationService, QuoteService} from "./quote.service";
import {Request, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";

@Controller('/api/quote')
export class QuoteController{
    constructor(private quoteService: QuoteService,
                private jwtService: JwtService,
                private userService: UserService) {
    }

    @Get()
    async getAll(){

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
            const count = this.quoteService.getAllQuotes({
                where:{
                    id: Number(id),
                    createrId: Number(user.id)
                }
            });
            return this.quoteService.deleteQuote({id: Number(id)});
            // return await this.userService.findUser({id: data['id']});
        }catch (e){
            throw new UnauthorizedException();
        }

    }
}