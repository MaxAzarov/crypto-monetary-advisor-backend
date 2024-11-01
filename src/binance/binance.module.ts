import { Module } from '@nestjs/common';

import { BinanceGateway } from './binance-gateway.gateway';
import { BinanceService } from './binance-service.service';

@Module({
  controllers: [],
  providers: [BinanceService, BinanceGateway],
})
export class BinanceModule {}
