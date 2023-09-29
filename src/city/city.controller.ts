import {Controller, Get} from "@nestjs/common";
import fs = require('fs');
import * as path from 'path';
import * as process from 'process';

@Controller('/api')
export class CityController{
    @Get('/cities')
    async getCity(){
        const text = fs.readFileSync(path.join(process.cwd(),'./other_data/rus_city.json'), 'utf-8').toString();
        return JSON.parse(text);
    }

}