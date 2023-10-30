import { ApiProperty } from '@nestjs/swagger';

export class ReqAppCreateDto {
  @ApiProperty({
    description: 'Наименование запроса',
  })
  name: string;
  @ApiProperty({
    description: 'Кол-во продуктов',
  })
  count_products: string;
  @ApiProperty({
    description: 'Город',
  })
  city: string;
  @ApiProperty({
    description: 'Id категории',
  })
  category_id: string;
  @ApiProperty({
    description: 'Дата реализации',
  })
  receipt_period: string;
}
