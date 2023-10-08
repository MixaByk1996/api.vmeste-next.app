import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server} from "socket.io";
import {QuoteService} from "../quote/quote.service";
@WebSocketGateway({namespace: 'events'})
export class EventsGateway {
  constructor(private quoteService : QuoteService) {
  }
  @WebSocketServer()
  server : Server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return payload;
  }

  sendMessage(){
    this.server.emit('newMessage', 'блаблаблаблабла');
  }

  async getMessages(){
    // @ts-ignore
    this.server.emit('getMessages', await this.quoteService.quotes());
  }
}
