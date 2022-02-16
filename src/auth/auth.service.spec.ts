import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockJwtService } from '../testing/mock.jwt.service';
import { AuthService } from './auth.service';
import { Buyer } from '../buyers/buyer.entity';
import { BuyersService } from '../buyers/buyers.service';
import { MockBuyersRepository } from '../buyers/testing/mock.buyers.repository';
import { LoggerWinston } from '../logger/logger-winston.service';

describe('AuthService', () => {
  let authService: AuthService;
  let buyersService: BuyersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    authService = module.get<AuthService>(AuthService);
    buyersService = module.get<BuyersService>(BuyersService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('a valid e-mail address and password have been passed - must return the user object', async () => {
      const email = 'test@test.com';
      const pass = 'test';
      expect(await authService.validateUser(email, pass)).toEqual({ id: 1, username: 'test', email: 'test@test.com' });
    });

    it('invalid email address have been passed - must return null', async () => {
      const email = 'test@tt.com';
      const pass = 'test';
      expect(await authService.validateUser(email, pass)).toBeNull();
    });

    it('invalid password have been passed - must return null', async () => {
      const email = 'test@test.com';
      const pass = 'tst';
      expect(await authService.validateUser(email, pass)).toBeNull();
    });
  });

  describe('facebookLogin', () => {
    it('user with stored e-mail address and facebookId have been passed - must return a object with field "accessToken"', async () => {
      const user = {
        email: 'test@test.com',
        facebookId: '00000007',
      };
      buyersService.findOne = jest.fn().mockReturnValueOnce({
        id: 1,
        username: 'test',
        email: 'test@test.com',
        facebookId: '00000007',
        password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
      });
      buyersService.update = jest.fn();
      buyersService.findOneByFacebookId = jest.fn();
      buyersService.create = jest.fn();

      expect(await authService.facebookLogin(user)).toHaveProperty('accessToken');
      expect(buyersService.findOne).toHaveBeenCalledTimes(1);
      expect(buyersService.update).toHaveBeenCalledTimes(0);
      expect(buyersService.findOneByFacebookId).toHaveBeenCalledTimes(0);
      expect(buyersService.create).toHaveBeenCalledTimes(0);
    });

    it('user with stored e-mail address but unstored facebookId have been passed - must return a object with field "accessToken"', async () => {
      const user = {
        email: 'test@test.com',
        facebookId: '00000008',
      };
      buyersService.findOne = jest.fn().mockReturnValueOnce({
        id: 1,
        username: 'test',
        email: 'test@test.com',
        password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
      });
      buyersService.update = jest.fn();
      buyersService.findOneByFacebookId = jest.fn();
      buyersService.create = jest.fn();

      expect(await authService.facebookLogin(user)).toHaveProperty('accessToken');
      expect(buyersService.findOne).toHaveBeenCalledTimes(1);
      expect(buyersService.update).toHaveBeenCalledTimes(1);
      expect(buyersService.findOneByFacebookId).toHaveBeenCalledTimes(0);
      expect(buyersService.create).toHaveBeenCalledTimes(0);
    });

    it('user with unstored email address but stored facebookId have been passed - must return a object with field "accessToken"', async () => {
      const user = {
        email: 'test2@test.com',
        facebookId: '00000007',
      };
      buyersService.findOne = jest.fn().mockReturnValueOnce(null);
      buyersService.update = jest.fn();
      buyersService.findOneByFacebookId = jest.fn().mockReturnValueOnce({
        id: 2,
        username: 'test',
        email: 'test@test.com',
        facebookId: '00000007',
        password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
      });
      buyersService.create = jest.fn();

      expect(await authService.facebookLogin(user)).toHaveProperty('accessToken');
      expect(buyersService.findOne).toHaveBeenCalledTimes(1);
      expect(buyersService.update).toHaveBeenCalledTimes(0);
      expect(buyersService.findOneByFacebookId).toHaveBeenCalledTimes(1);
      expect(buyersService.create).toHaveBeenCalledTimes(0);
    });

    it('user with unstored email address and facebookId have been passed - must return a object with field "accessToken"', async () => {
      const user = {
        email: 'test3@test.com',
        facebookId: '00000008',
        username: 'test',
      };
      buyersService.findOne = jest.fn().mockReturnValueOnce(null);
      buyersService.update = jest.fn();
      buyersService.findOneByFacebookId = jest.fn().mockReturnValueOnce(null);
      buyersService.create = jest.fn().mockReturnValueOnce({
        id: 3,
        username: 'test',
        email: 'test3@test.com',
        facebookId: '00000008',
      });

      expect(await authService.facebookLogin(user)).toHaveProperty('accessToken');
      expect(buyersService.findOne).toHaveBeenCalledTimes(1);
      expect(buyersService.update).toHaveBeenCalledTimes(0);
      expect(buyersService.findOneByFacebookId).toHaveBeenCalledTimes(1);
      expect(buyersService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('user have been passed - must return a object with field "accessToken"', async () => {
      const user = { id: 1, email: 'test@test.com' };
      expect(await authService.login(user)).toHaveProperty('accessToken');
    });
  });

  describe('register', () => {
    it('createBuyerDto have been passed - must return a buyer object', async () => {
      const createBuyerDto = { username: 'test', password: 'test', email: 'test@test.com' };
      expect(await authService.register({ ...createBuyerDto })).toHaveProperty('id');
      expect(await authService.register({ ...createBuyerDto })).toHaveProperty('username', 'test');
      expect(await authService.register({ ...createBuyerDto })).toHaveProperty('email', 'test@test.com');
    });
  });
});
