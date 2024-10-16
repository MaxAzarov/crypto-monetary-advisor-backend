import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { IJWTAuthorizedRequest } from 'src/common/types';

import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallets.service';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() { user }: IJWTAuthorizedRequest,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return this.walletService.create(user.id, createWalletDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() { user }: IJWTAuthorizedRequest) {
    return this.walletService.findAll(user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Request() { user }: IJWTAuthorizedRequest, @Param('id') id: number) {
    return this.walletService.findOne(user.id, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Request() { user }: IJWTAuthorizedRequest, @Param('id') id: number) {
    return this.walletService.remove(user.id, id);
  }
}
