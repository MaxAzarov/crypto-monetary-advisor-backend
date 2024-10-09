import { Module } from '@nestjs/common';

import { BinanceGateway } from './binance-gateway.gateway';
import { BinanceServiceController } from './binance-service.controller';
import { BinanceServiceService } from './binance-service.service';

@Module({
  controllers: [BinanceServiceController],
  providers: [BinanceServiceService, BinanceGateway],
})
export class BinanceServiceModule {}
