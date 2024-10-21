import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MonobankModule } from 'src/monobank/monobank.module';
import { MonobankService } from 'src/monobank/monobank.service';

import { OpenaiController } from './openai.controller';
import { OpenAIService } from './openai.service';

@Module({
  imports: [MonobankModule, HttpModule],
  controllers: [OpenaiController],
  providers: [OpenAIService, MonobankService],
})
export class OpenaiModule {}
