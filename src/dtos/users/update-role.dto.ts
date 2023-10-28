import {ApiProperty} from "@nestjs/swagger";

export class UpdateRoleDto{
    @ApiProperty({
        description : "Новое название роли"
    })
    new_role : string;
}