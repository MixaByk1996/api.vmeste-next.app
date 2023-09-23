import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Prisma, User} from "@prisma/client";

// @ts-ignore
@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {
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

    //async login()


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

