import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { serializeError } from 'serialize-error';
import { Server, Socket } from 'socket.io';

import { BinanceService } from './binance-service.service';

@WebSocketGateway({
  namespace: '/api/v1/socket',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class BinanceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(BinanceGateway.name);
  private subscriptions = new Map<string, Subscription>();

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  constructor(private readonly binanceService: BinanceService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const subscription = this.subscriptions.get(client.id);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(client.id);
    }
  }

  @SubscribeMessage('subscribeToCandle')
  async handleSubscribeToCandle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { pair: string },
  ) {
    try {
      if (data.pair) {
        const subscription = this.binanceService
          .getCandleEmitter(data.pair)
          .subscribe(
            (price) => {
              client.emit('candleData', price.toString());
            },
            (error) => {
              this.handleError(client, error);
            },
          );

        this.subscriptions.set(client.id, subscription);
      }
    } catch (error) {
      this.handleError(client, error);
    }
  }

  private handleError(client: Socket, error: Error) {
    const serializedError = serializeError(error);
    this.logger.error(
      `Error for client ${client.id}: ${serializedError.message}`,
    );
    client.emit('error', serializedError);
    client.disconnect();
  }
}
