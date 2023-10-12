import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import type {Prisma, User} from "@prisma/client";
import {MailerService} from "@nestjs-modules/mailer";
import {JwtService} from "@nestjs/jwt";
import process from "process";

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
        // @ts-ignore
        return this.prisma.user.create({
            data,
            select: {
                name: true,
                email: true,
                photo_url: true,
                accountCategory: true,
                balance: true,
                createAt: true
            }
        });
    }

    async findUser(condition: any): Promise<User>{
        // @ts-ignore
        return this.prisma.user.findFirst({
            where: condition
            // select: {
            //     name: true,
            //     email: true,
            //     photo_url: true,
            //     accountCategory: true,
            //     balance: true,
            //     createAt: true
            // }
        })
    }

    async sendEmail(email : string){
        const payload = {email};
        // @ts-ignore
        const token = this.jwtService.sign(payload, {
            secret : '7AnEd5epXmdaJfUrokkQ',
            expiresIn : '21600s'
        })
        const url = `http://localhost:3000/verification?token=${token}`;
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
            return payload.email;
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired');
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }
    //async login()

    async updateUser(email : string): Promise<User> {
        return this.prisma.user.update({
            where: {email: email},
            data: {hasVerification: true}

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

