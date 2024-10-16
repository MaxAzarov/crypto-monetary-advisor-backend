import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { IJWTAuthorizedRequest } from 'src/common/types';

import { CreateMonobankClientDto } from './dto/create-monobank-client.dto';
import { MonobankClient } from './entities/monobank-client.entity';
import { MonobankService } from './monobank.service';

@Controller('monobank')
@UseGuards(JwtAuthGuard)
export class MonobankController {
  constructor(private readonly monobankService: MonobankService) {}

  @Get(':id/client-info')
  async getClientInfo(@Param('id') id: string) {
    return this.monobankService.getClientInfo(id);
  }

  @Post('/')
  async create(
    @Request() { user }: IJWTAuthorizedRequest,
    @Body() createMonobankClientDto: CreateMonobankClientDto,
  ): Promise<MonobankClient> {
    return this.monobankService.create(user.id, createMonobankClientDto);
  }

  @Get('/')
  async findAll(
    @Request() { user }: IJWTAuthorizedRequest,
  ): Promise<MonobankClient[]> {
    return this.monobankService.findOneMonobankClients(user.id);
  }
}
