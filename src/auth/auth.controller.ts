import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UnauthorizedException
} from "@nestjs/common";
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {jwtConstants} from "./auth.constants";

@Controller()
export class AuthController{
    constructor(
        private readonly userService : UserService,
        private jwtService : JwtService
    ) {}

    // @Post('/api/auth/updateRole')
    // async updateRole(@Body('new_role') new_role: string, @Req() request: Request){
    //     const user = request['user'];
    //     return this.userService.updateUser({
    //         where :{id : Number(user.id)},
    //         data : {role : new_role}
    //     })
    // }
    @Post('/register')
    async register(
        @Body('name') name : string,
        @Body('email') email : string,
        @Body('password') password : string,
        @Body('photo_url') photo_url : string,
    ){
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.userService.sendEmail(email);
        return this.userService.register({
            accountCategory: "USER_ADMIN",
            name,
           email,
            photo_url,
           password : hashedPassword,
           hasVerification : false,
           balance : 0,
        });
    }

    @Post('/login')
    async login(
        @Body('email') email : string,
        @Body('password') password : string,
        @Res({passthrough: true}) response: Response
    ){
        const user = await this.userService.findUser({email});
        if(!user){
            throw new BadRequestException('Email is not in list');
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new BadRequestException('Password is not equals');
        }
        if(!user.hasVerification){
            throw new BadRequestException('Email is not verification');
        }
        const jwt = await this.jwtService.signAsync({id: user.id});
        response.cookie('jwt', jwt, {httpOnly:true});

        return user;
    }

    @Get('/verification/:token')
    async verification(@Param('token') token : string){
        const email = this.userService.decodeConfirmationToken(token);
        await this.userService.updateUser({
            where: {email: String(email)},
            data: {hasVerification: true}
        })
        return {
            message : "This email is activated now!"
        }
    }

    @Get('/api/auth/user')
    async user(@Req() request: Request){
        try{
            return request['user'];
        }catch (e){
            throw new UnauthorizedException();
        }
    }

    @Post('/logout')
    async logout(@Res({passthrough: true}) response : Response){
        response.clearCookie('jwt');
        return{
            message : 'success'
        }
    }
}