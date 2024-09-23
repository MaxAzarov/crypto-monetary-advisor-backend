import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  providers: [TypeOrmConfigService],
})
class AppModule {}

const setConfig = async () => {
  const app = await NestFactory.create(AppModule);
  const typeOrmServiceConfig = app.get(TypeOrmConfigService);
  fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(typeOrmServiceConfig.createTypeOrmOptions(), null, 2),
  );
  await app.close();
};

void setConfig();
