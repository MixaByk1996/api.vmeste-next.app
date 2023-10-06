import {Injectable, NestMiddleware} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly JwnSerice  : JwtService

    ) {}
    use(req: any, res: any, next: (error?: any) => void): any {
        let user;
        
    }

}