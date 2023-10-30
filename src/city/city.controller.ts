import { Controller, Get } from '@nestjs/common';
import fs = require('fs');
import * as path from 'path';
import * as process from 'process';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { json } from 'express';

@Controller('/api')
@ApiTags('City')
export class CityController {
  @Get('/cities')
  @ApiOkResponse({
    description: 'Список городов',
    type: json,
  })
  async getCity() {
    const text = fs
      .readFileSync(
        path.join(process.cwd(), './other_data/rus_city.json'),
        'utf-8',
      )
      .toString();
    return JSON.parse(text);
  }
}
