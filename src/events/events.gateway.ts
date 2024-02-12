import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { QuoteService } from '../quote/quote.service';
import {RequestappService} from "../request_app/requestapp.service";
@WebSocketGateway({ namespace: 'messages' })
export class EventsGateway {
  constructor(private quoteService: QuoteService, private reqAppService: RequestappService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return payload;
  }

  sendMessage() {
    this.server.emit('newMessage', 'блаблаблаблабла');
  }

  async getMessages() {
    // @ts-ignore
    let items = await this.quoteService.getAllQuotes();
    // @ts-ignore
    for (let i = 0; i < items.length; i++) {
      this.server.emit('get-messages/{'+items[i].id+'}', this.quoteService.getQuoteById(String(items[i].id)));
    }

  }
}
