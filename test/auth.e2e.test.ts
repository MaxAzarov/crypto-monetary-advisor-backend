import { JwtAuthGuard } from '@advisor/guards';
import { User } from '@advisor/users/entities';
import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';

import { AuthController } from './../src/auth/auth.controller';
import { AuthService } from './../src/auth/auth.service';
import { AuthLoginDto } from './../src/auth/dto/auth-login.dto';
import { SignupDto } from './../src/auth/dto/auth-signup.dto';
import { UsersService } from './../src/users/users.service';

jest.mock('bcryptjs');

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  } as User;

  const loginDto: AuthLoginDto = {
    email: 'test@example.com',
    password: 'password',
  };

  const signupDto: SignupDto = {
    email: 'volodor05412@example.com',
    password: 'password',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: EntityManager,
          useFactory: () => ({
            getRepository: () => ({
              findOne: jest.fn().mockResolvedValue(mockUser),
              save: jest.fn().mockResolvedValue(mockUser),
            }),
          }),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser; // mock user data for JwtAuthGuard
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    usersService = moduleFixture.get<UsersService>(UsersService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should log in a user and return a token', () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('token', 'mockedToken');
        expect(res.body.user).toMatchObject({ email: loginDto.email });
      });
  });

  it('/auth/signup (POST) - should sign up a new user', () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null); // No user exists
    jest.spyOn(usersService, 'create').mockResolvedValue({
      id: 2,
      email: signupDto.email,
      password: 'hashedPassword',
    } as User);

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupDto)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('email', signupDto.email);
      });
  });

  it('/auth/me (GET) - should return current user details', () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', mockUser.id);
        expect(res.body).toHaveProperty('email', mockUser.email);
      });
  });
});
