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

@Controller('/api/auth')
export class AuthController{
    constructor(
        private readonly userService : UserService,
        private jwtService : JwtService
    ) {}

    @Post('/updateRole')
    async updateRole(@Body('new_role') new_role: string, @Req() request: Request){
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie,{
            secret: jwtConstants.secret
        });
        if(!data){
            throw new UnauthorizedException();
        }
        return this.userService.updateUser({
            where :{id : Number(data['id'])},
            data : {role : new_role}
        })
    }
    @Post('/register')
    async register(
        @Body('name') name : string,
        @Body('email') email : string,
        @Body('password') password : string,
        @Body('photo_url') photo_url : string,
        @Body('role') role : string,
        @Body('hasVerification') hasVerification : boolean,
        @Body('account_category') account_category : string,
    ){
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.userService.sendEmail(email);

        return this.userService.register({
            accountCategory: account_category,
            name,
           email,
            photo_url,
            role,
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

    @Get('/verification/:email')
    async verification(@Param('email') email: string){

        await this.userService.updateUser({
            where: {email: String(email)},
            data: {hasVerification: true}
        })
        return {
            message : "This email is activated now!"
        }
    }

    @Get('/user')
    async user(@Req() request: Request){
        try{
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie,{
                secret: jwtConstants.secret
            });
            if(!data){
                throw new UnauthorizedException();
            }
            return await this.userService.findUser({id: data['id']});
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