import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";

@Controller('/auth')
export class AuthController{
    constructor(
        private readonly userService : UserService,
        private jwtService : JwtService
    ) {}

    @Post('/register')
    async register(
        @Body('name') name : string,
        @Body('email') email : string,
        @Body('password') password : string,
        @Body('account_category') account_category : string,
    ){
        const hashedPassword = await bcrypt.hash(password, 12);

        // @ts-ignore
        return this.userService.register({
            accountCategory: account_category,
            name,
           email,
           password : hashedPassword,
           hasVerification : false,
           balance : 0,
        });
    }

    @Post('/login')
    async login(
        @Body('email') email : string,
        @Body('password') password : string,
        @Res({passthrough: true}) responce: Response
    ){
        const user = await this.userService.findUser({email});
        if(!user){
            throw new BadRequestException('Email is not in list');
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new BadRequestException('Password is not equals');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});
        responce.cookie('jwt', jwt, {httpOnly:true});

        return user;
    }

    @Get('/user')
    async user(@Req() request: Request){
        try{
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if(!data){
                throw new UnauthorizedException();
            }
            return await this.userService.findUser({id: data['id']});
        }catch (e){
            throw new UnauthorizedException();
        }
    }

    @Post('/logout')
    async logout(@Res({passthrough: true}) responce : Response){
        responce.clearCookie('jwt');
        return{
            message : 'success'
        }
    }
}