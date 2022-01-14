import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { Buyer } from './buyers/buyer.entity';
import { BuyersService } from './buyers/buyers.service';
import { MockRepository } from './buyers/testing/mock.repository';
import { MockJwtService } from './testing/mock.jwt.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AuthService,
        BuyersService,
        {
          provide: getRepositoryToken(Buyer),
          useClass: MockRepository,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
