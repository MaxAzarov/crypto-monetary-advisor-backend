import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { BinanceModule } from './binance/binance.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MonobankModule } from './monobank/monobank.module';
import { OpenaiModule } from './openai/openai.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        DATABASE_TYPE: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        AUTH_TOKEN_SECRET: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    WalletsModule,
    OpenaiModule,
    BinanceModule,
    MonobankModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
