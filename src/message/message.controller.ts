import {Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException} from "@nestjs/common";
import {MessageService} from "./message.service";
import {QuoteService} from "../quote/quote.service";
import {jwtConstants} from "../auth/auth.constants";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {Request} from "express";
import {PrismaService} from "../../prisma/prisma.service";

@Controller("/api/message")
export class MessageController{
    constructor(
        private messageSerice: MessageService,
        private quoteService: QuoteService,
        private prismaService : PrismaService,
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    @Get('/get-messages/:id')
    async getMessages(@Param('id') id : string){
        return this.quoteService.getQuoteById(id);
    }

    @Post('/create-quiz-message')
    async createMessageQuiz(
        @Body('question') question : string,
        @Body('answers_json') answers_json : string,
        @Body('quote_id') quote_id : string,
        @Req() request : Request
    ){
        let arr_answers = [];
        let answers_added = [];
        arr_answers = JSON.parse(answers_json);
        for (let i = 0; i < arr_answers.length; i++){
            answers_added[i] = await this.prismaService.answer.create({
                data : {text : arr_answers[i]}
            })
        }

        const quiz = await this.prismaService.quiz.create({
            data : {text : question, answers : {
                connect: answers_added
            }}
        })
        const user = request['user'];
        const quote = await this.quoteService.getQuoteById(quote_id);
        return this.messageSerice.createMessage({
            type: "TYPE_QUIZ",
            creater : {
                connect : user
            },
            quote: {
                connect : quote
            },
            quiz: {
                connect: quiz
            }
        })
    }

    @Delete('/delete-quiz-message/:id')
    async deleteQuiz(@Param('id') id : string){
        return this.messageSerice.deleteMessage(id);
    }

    @Post('/create-text-message')
    async createMessage(
        @Body('text') text : string,
        @Body('quote_id') quote_id : string,
        @Req() request : Request
    ){

        const user = request['user'];
        const quote = await this.quoteService.getQuoteById(quote_id);
        return this.messageSerice.createMessage({
            text,
            type : "TYPE_TEXT",
            creater:{
                connect : user
            },
            quote:{
                connect: quote
            }
        })
    }
}