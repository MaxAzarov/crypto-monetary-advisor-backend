import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
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
      }),
    }),
    AuthModule,
    UsersModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
