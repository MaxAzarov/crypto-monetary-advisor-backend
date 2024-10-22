import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';

import { JwtAuthGuard } from '../src/auth/guards';
import { getRepositoryMock } from '../src/helpers/test';
import { WalletController } from '../src/wallets/wallets.controller';
import { WalletService } from './../src/wallets/wallets.service';

describe('WalletController (e2e)', () => {
  let app: INestApplication;

  const wallet = {
    id: 1,
    accountAddress: '',
    walletName: '',
  };

  const walletRepositoryMock = getRepositoryMock(wallet);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        WalletService,
        {
          provide: EntityManager,
          useFactory: () => ({ getRepository: () => walletRepositoryMock }),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = {
            id: 1,
          };

          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/wallets (POST)', () => {
    return request(app.getHttpServer())
      .post('/wallets')
      .send({ name: 'Test Wallet' })
      .expect(201)
      .expect(wallet);
  });

  it('/wallets (GET)', () => {
    return (
      request(app.getHttpServer())
        .get('/wallets')
        .expect(200)
        // .expect(walletService.findAll);
        .expect([wallet])
    );
  });

  it('/wallets/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/wallets/1')
      .expect(200)
      .expect(wallet);
  });

  it('/wallets/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/wallets/1')
      .send({ name: 'Updated Wallet' })
      .expect(200)
      .expect(wallet);
  });

  it('/wallets/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/wallets/1').expect(200);
  });
});
