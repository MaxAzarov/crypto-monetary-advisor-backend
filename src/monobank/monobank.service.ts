import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { EntityManager } from 'typeorm';

import { CreateMonobankClientDto } from './dto/create-monobank-client.dto';
import { MonobankClient } from './entities/monobank-client.entity';

@Injectable()
export class MonobankService {
  private readonly apiUrl = 'https://api.monobank.ua/personal/client-info';

  constructor(
    private readonly httpService: HttpService,
    private readonly entityManager: EntityManager,
  ) {}

  async getClientInfo(id: string): Promise<any> {
    try {
      const client = await this.findOneMonobankClient(id);

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(this.apiUrl, {
          headers: { 'X-Token': client.monobankKey },
        }),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve client info');
    }
  }

  async findOneMonobankClients(userId: number) {
    const monobankRepository = this.entityManager.getRepository(MonobankClient);

    const monobankClients = await monobankRepository.find({
      where: { userId },
    });

    return monobankClients;
  }

  async findOneMonobankClient(id: string): Promise<MonobankClient> {
    const monobankRepository = this.entityManager.getRepository(MonobankClient);

    const monobankClient = await monobankRepository.findOne({ where: { id } });

    if (!monobankClient) {
      throw new NotFoundException(`MonobankClient with id ${id} not found`);
    }

    return monobankClient;
  }

  async create(
    userId: number,
    createMonobankClientDto: CreateMonobankClientDto,
  ): Promise<MonobankClient> {
    const monobankRepository = this.entityManager.getRepository(MonobankClient);

    return await monobankRepository.save(
      monobankRepository.create({ userId, ...createMonobankClientDto }),
    );
  }
}
