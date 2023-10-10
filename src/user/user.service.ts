import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Prisma, User} from "@prisma/client";
import {MailerService} from "@nestjs-modules/mailer";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";

// @ts-ignore
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailerService: MailerService,
        private readonly jwtService : JwtService,
    ) {
    }

    // @ts-ignore
    async register(data : Prisma.UserCreateInput) : Promise<User>{
        const createdUser = this.prisma.user.create({
            data
        });
        // @ts-ignore
        const {password, ...result} = createdUser;
        return createdUser;
    }

    async findUser(condition: any): Promise<User>{
        return this.prisma.user.findFirst({
            where: condition
        })
    }

    async sendEmail(email : string){
        const payload = {email};
        // @ts-ignore
        const token = this.jwtService.sign(payload, {
            secret : '7AnEd5epXmdaJfUrokkQ',
            expiresIn : '21600s'
        })
        const url = `http://localhost:3000/confirm-email?token=${token}`;
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
        await this.mailerService.sendMail({
            to: email,
            from: 'app.vmeste-mail@mail.ru',
            subject: 'Верификация аккаунта',
            text
        })
    }

    async decodeConfirmationToken(token : string){
        try {
            const payload = await this.jwtService.verify(token, {
                secret: '7AnEd5epXmdaJfUrokkQ',
            });

            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired');
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }
    //async login()

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { data, where } = params;
        return this.prisma.user.update({
            data,
            where,
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

