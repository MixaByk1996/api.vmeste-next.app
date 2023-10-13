import {Controller, Get} from "@nestjs/common";
import fs = require('fs');
import * as path from 'path';
import * as process from 'process';
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {json} from "express";

@Controller('/api')
@ApiTags('City')
export class CityController{
    @Get('/cities')
    @ApiBody({description: "Список городов", type : json})
    @ApiResponse({status : 200})
    async getCity(){
        const text = fs.readFileSync(path.join(process.cwd(),'./other_data/rus_city.json'), 'utf-8').toString();
        return JSON.parse(text);
    }

}