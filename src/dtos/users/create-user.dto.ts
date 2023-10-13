import {ApiProperty} from "@nestjs/swagger";

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
}