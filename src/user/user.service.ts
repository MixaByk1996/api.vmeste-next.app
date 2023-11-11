import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma, User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import process from 'process';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import * as bcrypt from 'bcrypt';
import { TypeUser } from '@prisma/client';

// @ts-ignore
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  // @ts-ignore
  async register(user: CreateUserDto): Promise<User> {
    let em = TypeUser.USER_ORDINARY;
    switch (user.account_category) {
      case 'USER_ORDINARY':
        em = TypeUser.USER_ORDINARY;
        break;
      case 'USER_DELIVERY':
        // @ts-ignore
        em = TypeUser.USER_DELIVERY;
        break;
      case 'USER_ADMIN':
        // @ts-ignore
        em = TypeUser.USER_ADMIN;
        break;
      case 'USER_MODERATOR':
        // @ts-ignore
        em = TypeUser.USER_MODERATOR;
        break;
    }
    // @ts-ignore
    return this.prisma.user.create({
      data: {
        name: user.name,
        hasVerification: false,
        password: await bcrypt.hash(user.password, 12),
        photo_url: user.photo_url,
        accountCategory: em,
        balance: 0,
        email: user.email,
      },
      select: {
        name: true,
        email: true,
        photo_url: true,
        accountCategory: true,
        balance: true,
        createAt: true,
      },
    });
  }

  async findUser(condition: any): Promise<User> {
    // @ts-ignore
    return this.prisma.user.findFirst({
      where: condition,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        photo_url: true,
        accountCategory: true,
        hasVerification: true,
        balance: true,
        createAt: true,
        quotes: true,
        votes: true,
        messages: true
      }
    }) || [];
  }

  async sendEmail(email: string) {
    const payload = { email };
    // @ts-ignore
    const token = this.jwtService.sign(payload, {
      secret: '7AnEd5epXmdaJfUrokkQ',
      expiresIn: '21600s',
    });
    const url = `http://91.107.125.160:82/verification?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
    await this.mailerService.sendMail({
      to: email,
      from: 'app.vmeste-mail@mail.ru',
      subject: 'Верификация аккаунта',
      text,
    });
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: '7AnEd5epXmdaJfUrokkQ',
      });
      return payload.email;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
  //async login()

  async updateUser(email: string): Promise<User> {
    return this.prisma.user.update({
      where: { email: email },
      data: { hasVerification: true },
    });
  }

  async updateRole(id: string, role: string): Promise<User> {
    let em = TypeUser.USER_ORDINARY;
    switch (role) {
      case 'USER_ORDINARY':
        em = TypeUser.USER_ORDINARY;
        break;
      case 'USER_DELIVERY':
        // @ts-ignore
        em = TypeUser.USER_DELIVERY;
        break;
      case 'USER_ADMIN':
        // @ts-ignore
        em = TypeUser.USER_ADMIN;
        break;
      case 'USER_MODERATOR':
        // @ts-ignore
        em = TypeUser.USER_MODERATOR;
        break;
    }
    // @ts-ignore
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: { accountCategory: em },
      select: {
        id: true,
        name: true,
        email: true,
        photo_url: true,
        accountCategory: true,
        balance: true,
        createAt: true,
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
