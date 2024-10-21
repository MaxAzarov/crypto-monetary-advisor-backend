import { Module } from '@nestjs/common';

import { BinanceGateway } from './binance-gateway.gateway';
import { BinanceServiceController } from './binance-service.controller';
import { BinanceService } from './binance-service.service';

@Module({
  controllers: [BinanceServiceController],
  providers: [BinanceService, BinanceGateway],
})
export class BinanceServiceModule {}
