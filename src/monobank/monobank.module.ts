import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MonobankController } from './monobank.controller';
import { MonobankService } from './monobank.service';

@Module({
  imports: [HttpModule],
  controllers: [MonobankController],
  providers: [MonobankService],
})
export class MonobankModule {}
