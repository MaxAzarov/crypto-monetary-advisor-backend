import { HttpModule } from '@nestjs/axios';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';

import { JwtAuthGuard } from '../src/auth/guards';
import { getRepositoryMock } from '../src/helpers/test';
import { MonobankController } from '../src/monobank/monobank.controller';
import { MonobankService } from '../src/monobank/monobank.service';

describe('MonobankController (e2e)', () => {
  let app: INestApplication;

  const monobankClient = {
    id: '1',
    userId: 1,
    monobankKey: 'ujLRJwGmGbDP1Qlm5C3_6-CVkhiwxVlwqZwgZZ1Ckxrk',
    clientName: 'Test Client',
  };

  const monobankRepositoryMock = getRepositoryMock(monobankClient);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [MonobankController],
      providers: [
        MonobankService,
        {
          provide: EntityManager,
          useFactory: () => ({ getRepository: () => monobankRepositoryMock }),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = { id: 1 };
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

  it('/monobank (POST)', () => {
    return request(app.getHttpServer())
      .post('/monobank')
      .send({ monobankKey: 'test-key', clientName: 'Test Client' })
      .expect(201)
      .expect(monobankClient);
  });

  it('/monobank (GET)', () => {
    return request(app.getHttpServer())
      .get('/monobank')
      .expect(200)
      .expect([monobankClient]);
  });

  it('/monobank/:id/client-info (GET)', () => {
    return request(app.getHttpServer())
      .get('/monobank/1/client-info')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('clientId', 'A2YKjKMSjB');
      });
  });
});
