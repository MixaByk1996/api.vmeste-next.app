import {Module} from "@nestjs/common";
import {AppController} from "../app.controller";
import {CityController} from "./city.controller";

@Module({
    controllers: [CityController]
    }
)
export class CityModule{}