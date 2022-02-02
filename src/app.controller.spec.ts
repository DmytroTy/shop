import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { Buyer } from './buyers/buyer.entity';
import { BuyersService } from './buyers/buyers.service';
import { MockBuyersRepository } from './buyers/testing/mock.buyers.repository';
import { LoggerWinston } from './logger/logger-winston.service';
import { MockJwtService } from './testing/mock.jwt.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ConfigService,
        LoggerWinston,
        AuthService,
        BuyersService,
        {
          provide: getRepositoryToken(Buyer),
          useClass: MockBuyersRepository,
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
