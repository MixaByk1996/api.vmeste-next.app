import {Controller, Delete, Param} from "@nestjs/common";
// @ts-ignore
import {ApplicationService} from "./application.service";

@Controller('/api/application')
export class ApplicationController{
    constructor(private applicationService: ApplicationService) {
    }
    @Delete("/:id")
    async delete(@Param('id') id: string){

    }
}