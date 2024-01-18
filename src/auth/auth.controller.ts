import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { jwtConstants } from './auth.constants';
import {
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { LoginUserDto } from '../dtos/users/login-user.dto';
import { TypeUser } from '@prisma/client';
import { UpdateRoleDto } from '../dtos/users/update-role.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller()
@ApiTags('Users')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/api/auth/update-role')
  @ApiBody({ description: 'Метод: обновление роли.', type: UpdateRoleDto })
  async updateRole(
    @Req() request: Request,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const user = await request['user'];
    return this.userService.updateRole(user.id, updateRoleDto.new_role);
  }

  @Post('/api/auth/change-avatar')
  @UseInterceptors(FileInterceptor('photo', { dest: './uploads' }))
  async uploadSingle( @UploadedFile() file : Express.Multer.File) {
    //const user = await request['user'];
    console.log(file);
    // console.log(user);
  }


  @Post('/register')
  @ApiBody({ description: 'Регистрация пользователей', type: CreateUserDto })
  async register(@Body() createUser: CreateUserDto) {
    const email = createUser.email;
    const user = await this.userService.findUser({ email });
    if (user) {
      throw new BadRequestException(
        'Пользователь с такой почтой существует в системе',
      );
    }
    await this.userService.sendEmail(createUser.email);
    return this.userService.register(createUser);
  }

  @Post('/login')
  @ApiBody({ description: 'Вход в акк', type: LoginUserDto })
  async login(
    @Body() userLogin: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    var email = userLogin.email;
    // @ts-ignore
    const user = await this.userService.findUser({email : email });
    if (!user) {
      throw new BadRequestException('Email is not in list');
    }
    console.log(user);
    if (!(await bcrypt.compare(userLogin.password, user.password))) {
      throw new BadRequestException('');
    }
    if (!user.hasVerification) {
      throw new BadRequestException('Почта не верифицирована!');
    }
    const jwt = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: jwtConstants.secret,
      },
    );
    response.cookie('jwt', jwt, { secure: true, sameSite: 'none' });

    return user;
  }

  @Get('/verification')
  @ApiResponse({
    description: 'Верификация почты по токену, отправленному на почту',
  })
  @ApiQuery({ name: 'token', description: 'Токен для верификации' })
  async verification(@Query('token') token: string) {
    const email = this.userService.decodeConfirmationToken(token);
    await this.userService.updateUser(await email);
    return {
      message: 'This email is activated now!',
    };
  }

  @Get('/get-user-by-id')
  @ApiBody({ description: 'Информация о  пользователе по id' })
  @ApiQuery({ name: 'user_id', description: 'Id пользователя' })
  async getUserById(@Query('user_id') user_id: string) {
    return await this.userService.findUser({ id: Number(user_id) });
  }

  @Get('/api/auth/user')
  @ApiBody({ description: 'Информация о текущем пользователе' })
  @ApiResponse({ status: 200, description: 'Текущий пользователь' })
  @ApiResponse({ status: 401, description: 'Не авторизирован пользователь' })
  async user(@Req() request: Request) {
    try {
      return request['user'];
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/logout')
  @ApiBody({ description: 'Выход' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Вы вышли из системы',
    };
  }
}
