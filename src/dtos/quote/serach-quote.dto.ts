import { ApiProperty } from '@nestjs/swagger';

export class SerachQuoteDto {
  @ApiProperty({
    description: 'Поиск по строке',
  })
  text: string;
}
