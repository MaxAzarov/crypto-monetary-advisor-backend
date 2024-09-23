import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({ PORT: Joi.number().port().default(3000) }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
