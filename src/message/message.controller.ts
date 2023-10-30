import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req} from "@nestjs/common";
import {MessageService} from "./message.service";
import {QuoteService} from "../quote/quote.service";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {Request} from "express";
import {PrismaService} from "../../prisma/prisma.service";
import {ApiBody, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateQuizMessageDto} from "../dtos/message/create-quiz-message.dto";
import {CreateTextMessageDto} from "../dtos/message/create-text-message.dto";

@Controller("/api/message")
@ApiTags('Message')
export class MessageController{
    constructor(
        private messageSerice: MessageService,
        private quoteService: QuoteService,
        private prismaService : PrismaService,
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    @Get('/get-messages-by-quote')
    @ApiBody({description: "Получение ссобщений в заявке"})
    @ApiQuery({name : 'id', description : 'Id заявки'})
    @ApiResponse({status: 200, description: 'return: Заявка со сообщениями в ней'})
    async getMessages(@Query('id') id : string){
        return this.quoteService.getQuoteById(id);
    }

    @Post('/create-quiz-message')
    @ApiBody({description: "Создание сообщения с опросом в чате", type : CreateQuizMessageDto})
    async createMessageQuiz(
        @Body() createQuiz : CreateQuizMessageDto,
        @Req() request : Request
    ){
        let arr_answers = [];
        let answers_added = [];
        arr_answers = createQuiz.answers.split(';');//JSON.parse(answers_json);
        const question = createQuiz.question;
        for (let i = 0; i < arr_answers.length; i++){
            answers_added[i] = await this.prismaService.answer.create({
                data : {text : arr_answers[i]}
            })
        }
        const user = request['user'];
        const quote = await this.quoteService.getQuoteById(createQuiz.quote_id);
        if(!quote){
            throw new BadRequestException("Quote is not found!");
        }
        const quiz = await this.prismaService.quiz.create({
            data :
                {text : question,
                    answers : {
                        connect: answers_added
                    }
                }
        })
        // @ts-ignore


        return await this.messageSerice.createMessage({
            type: "TYPE_QUIZ",
            creater: {
                connect: await this.userService.findUser({id: user.id})
            },
            quote: {
                connect: quote
            },
            quiz: {
                connect: quiz
            }
        });
    }

    @Delete('/delete-quiz-message')
    @ApiBody({description: "Удаление опроса"})
    @ApiQuery({name : 'id', description: 'Id сообщения - опроса'})
    async deleteQuiz(@Query('id') id : string){
        return this.messageSerice.deleteMessage(id);
    }

    @Post('/create-text-message')
    @ApiBody({description: "Создание обычного текстового сообщения", type : CreateTextMessageDto})
    async createMessage(
        @Body() createMessage : CreateTextMessageDto,
        @Req() request : Request
    ){
        const user = request['user'];
        const text = createMessage.text;
        const quote = await this.quoteService.getQuoteById(createMessage.text);
        if(!quote){
            throw new BadRequestException("Заявка не найдена!");
        }
        return this.messageSerice.createMessage({
            text,
            type : "TYPE_TEXT",
            creater: {
                connect: await this.userService.findUser({id: user.id})
            },
            quote:{
                connect: quote
            }
        })
    }
}