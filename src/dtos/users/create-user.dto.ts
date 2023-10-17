import {ApiProperty} from "@nestjs/swagger";
import {TypeUser} from "@prisma/client";

export class CreateUserDto{
    @ApiProperty({
        description: "Никнейм"
    })
    name : string;
    @ApiProperty({
        description: "Электронная почта"
    })
    email : string;
    @ApiProperty({
        description: "Пароль"
    })
    password : string;
    @ApiProperty({
        description: "Авка(в формате base64)"
    })
    photo_url : string;
    @ApiProperty({
        description: "Тип пользователя(\"USER_ORDINARY\" - обычный пользователь, \"USER_DELIVERY\" - поставщик,\"USER_MODERATOR\" - модератор,\"USER_ADMIN\" - админ)"
    })
    account_category : string;
}