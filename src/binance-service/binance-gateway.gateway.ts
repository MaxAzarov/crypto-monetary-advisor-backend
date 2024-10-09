import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { serializeError } from 'serialize-error';
import { Server, Socket } from 'socket.io';

import { BinanceServiceService } from './binance-service.service';

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

  constructor(private readonly binanceServiceService: BinanceServiceService) {}

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
  async handleSubscribeToCandle(client: Socket, token: string) {
    try {
      this.logger.log(`Client ${client.id} authenticated with token: ${token}`);

      const subscription = this.binanceServiceService
        .getCandleEmitter()
        .subscribe(
          (price) => {
            client.emit('candleData', price.toString());
          },
          (error) => {
            this.handleError(client, error, token);
          },
        );

      this.subscriptions.set(client.id, subscription);
    } catch (error) {
      this.handleError(client, error, token);
    }
  }

  private handleError(client: Socket, error: Error, token: string) {
    const serializedError = serializeError(error);
    this.logger.error(
      `Error for client ${client.id} with token ${token}: ${serializedError.message}`,
    );
    client.emit('error', serializedError);
    client.disconnect();
  }
}
