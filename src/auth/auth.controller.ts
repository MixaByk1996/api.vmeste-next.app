import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException
} from "@nestjs/common";
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {jwtConstants} from "./auth.constants";
import {ApiBody, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../dtos/users/create-user.dto";
import {LoginUserDto} from "../dtos/users/login-user.dto";
import {TypeUser} from "@prisma/client";

@Controller()
@ApiTags('Users')
export class AuthController{
    constructor(
        private readonly userService : UserService,
        private jwtService : JwtService
    ) {}

    @Post('/api/auth/updateRole')
    @ApiBody({description: 'Метод: обновление роли. Одно поле в body : text (USER_ORDINARY,USER_DELIVERY)'})
    async updateRole(@Body('new_role') new_role: string, @Req() request: Request){
        const user = request['user'];
        return this.userService.updateRole(user.email, new_role);
    }
    @Post('/register')
    @ApiBody({description: "Регистрация пользователей"})
    async register(
        @Body() createUser : CreateUserDto
    ){
        const email = createUser.email;
        const user = await this.userService.findUser({email});
        if(user){
            throw new BadRequestException('Пользователь с такой почтой существует в системе');
        }
        await this.userService.sendEmail(createUser.email);
        return this.userService.register(createUser);
    }

    @Post('/login')
    @ApiBody({description: "Вход в акк"})
    async login(
        @Body() userLogin : LoginUserDto,
        @Res({passthrough: true}) response: Response
    ){
        const email = userLogin.email;
        // @ts-ignore
        const user = await this.userService.findUser({email});
        if(!user){
            throw new BadRequestException('Email is not in list');
        }

        if(!await bcrypt.compare(userLogin.password, user.password)){
            throw new BadRequestException('');
        }
        if(!user.hasVerification){
            throw new BadRequestException('Почта не верифицирована!');
        }
        const jwt = await this.jwtService.signAsync({id: user.id},{
            secret: jwtConstants.secret
        });
        response.cookie('jwt', jwt, {httpOnly:true});

        return user;
    }

    @Get('/verification')
    @ApiResponse({description: "Верификация почты по токену, отправленному на почту"})
    @ApiQuery({name : "token", description : "Токен для верификации"})
    async verification(@Query('token') token : string){
        const email = this.userService.decodeConfirmationToken(token);
        await this.userService.updateUser(await email)
        return {
            message : "This email is activated now!"
        }
    }

    @Get('/api/auth/user')
    @ApiBody({description: "Информация о текущем пользователе"})
    @ApiResponse({status: 200, description : "Текущий пользователь"})
    @ApiResponse({status: 401, description : "Не авторизирован пользователь"})
    async user(@Req() request: Request){
        try{
            return request['user'];
        }catch (e){
            throw new UnauthorizedException();
        }
    }

    @Post('/logout')
    @ApiBody({description: "Выход"})
    async logout(@Res({passthrough: true}) response : Response){
        response.clearCookie('jwt');
        return{
            message : 'Вы вышли из системы'
        }
    }
}