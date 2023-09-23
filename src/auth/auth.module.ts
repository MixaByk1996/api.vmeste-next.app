import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {UserService} from "../user/user.service";
import {PrismaService} from "../../prisma/prisma.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports:[JwtModule.register({
        secret: 'secret',
        signOptions: {expiresIn: '1d'}
    })],
    controllers: [AuthController],
    providers: [UserService, PrismaService]
})
export class AuthModule{}