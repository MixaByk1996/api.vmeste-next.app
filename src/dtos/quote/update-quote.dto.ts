import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuoteDto {
  @ApiProperty({
    description: 'Наименование заявки',
  })
  name: string;
  @ApiProperty({
    description: 'Срок реализации',
  })
  realization_period: string;
  @ApiProperty({
    description: 'Статус',
  })
  status: string;
  @ApiProperty({
    description: 'Теги',
  })
  tags: string;
  @ApiProperty({
    description: 'Описание',
  })
  description: string;
  @ApiProperty({
    description: 'Фото(base64)',
  })
  photo: string;
  @ApiProperty({
    description: 'Наименование города',
  })
  city_name: string;
  @ApiProperty({
    description: 'Id категории',
  })
  category_id: number;
  @ApiProperty({
    description: 'Минимальная цена',
  })
  min_amount: number;
}
