import {ForbiddenException, Injectable, NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../auth/auth.constants";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService  : JwtService

    ) {}
    use(req: any, res: any, next: (error?: any) => void): any {
        let user;
        const cookie = req.cookies['jwt'];
        if(!cookie){
            throw new UnauthorizedException();
        }
        const data = this.jwtService.verifyAsync(cookie,{
            secret: jwtConstants.secret
        });
        if(!data){
            throw new ForbiddenException('Please register or sign in.');
        }
        user = this.userService.findUser({id : data['id']});
        if(user){
            req.user = user;
            next();
        }
        else {
            throw new UnauthorizedException();
        }
    }

}