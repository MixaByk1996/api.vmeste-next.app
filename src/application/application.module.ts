import {Module} from "@nestjs/common";
import {ApplicationController} from "./application.controller";
import {UserService} from "../user/user.service";
import {PrismaService} from "../../prisma/prisma.service";
import {ApplicationService} from "./application.service";
import {AuthModule} from "../auth/auth.module";

// @ts-ignore
@Module({
    controllers: [ApplicationController],
    providers: [ApplicationService]
})
export class ApplicationModule{}