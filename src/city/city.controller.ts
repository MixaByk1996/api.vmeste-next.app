import {Controller, Get} from "@nestjs/common";
import fs = require('fs');

@Controller()
export class CityController{
    @Get('/cities')
    async getCity(){
        // @ts-ignore
        //read citites from json file(feature)
        // const file_content = fs.readFile("../../other_data/rus_city.json");
        // return file_content;
    }

}