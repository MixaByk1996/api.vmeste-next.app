import {Controller} from "@nestjs/common";
import {RequestappService} from "./requestapp.service";
import {CategoryService} from "../category/category.service";

@Controller("/api/request-app/")
export class RequestappController{
    constructor(
        private requestappService : RequestappService,
        private categoryService : CategoryService
    ) {
    }
}