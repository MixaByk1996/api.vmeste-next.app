import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Почта',
  })
  email: string;
  @ApiProperty({
    description: 'Пароль',
  })
  password: string;
}
