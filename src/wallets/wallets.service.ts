import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CreateWalletDto } from './dto/create-wallet.dto'; // DTO for create
import { UpdateWalletDto } from './dto/update-wallet.dto'; // DTO for update
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(
    userId: number,
    createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    const walletRepository = this.entityManager.getRepository(Wallet);

    const wallet = walletRepository.create({
      ...createWalletDto,
      userId,
    });

    return this.entityManager.save(Wallet, wallet);
  }

  async findAll(userId: number): Promise<Wallet[]> {
    const walletRepository = this.entityManager.getRepository(Wallet);

    return walletRepository.find({ where: { userId } });
  }

  async findOne(userId: number, id: number): Promise<Wallet> {
    const walletRepository = this.entityManager.getRepository(Wallet);

    const wallet = await walletRepository.findOne({ where: { id, userId } });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return wallet;
  }

  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const walletRepository = this.entityManager.getRepository(Wallet);

    const wallet = await walletRepository.preload({
      id,
      ...updateWalletDto,
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return walletRepository.save(wallet);
  }

  async remove(userId: number, id: number): Promise<void> {
    const wallet = await this.findOne(userId, id);

    const walletRepository = this.entityManager.getRepository(Wallet);

    await walletRepository.remove(wallet);
  }
}
