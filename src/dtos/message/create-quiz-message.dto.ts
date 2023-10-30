import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizMessageDto {
  @ApiProperty({
    description: 'Сам вопрос',
  })
  question: string;
  @ApiProperty({
    description: 'Варианты ответов',
    example: 'Вариант1;Вариант2;Вариант3',
  })
  answers: string;
  @ApiProperty({
    description: 'Id заявки',
  })
  quote_id: string;
}
