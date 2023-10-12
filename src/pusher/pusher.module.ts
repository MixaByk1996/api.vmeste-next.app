import {Module} from "@nestjs/common";
import {QuoteModule} from "../quote/quote.module";
import {EventsGateway} from "../events/events.gateway";
import {QuoteService} from "../quote/quote.service";
import {PrismaService} from "../../prisma/prisma.service";
import {PusherGateway} from "./pusher.gateway";

@Module({
    imports: [QuoteModule],
    providers: [PusherGateway, QuoteService,PrismaService]
})
export class PusherModule{}