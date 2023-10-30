import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Описание события',
  })
  name: string;
  @ApiProperty({
    description: 'Id заявки',
  })
  quote_id: string;
}
