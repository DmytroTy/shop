import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockJwtService } from '../testing/mock.jwt.service';
import { AuthService } from './auth.service';
import { Buyer } from '../buyers/buyer.entity';
import { BuyersService } from '../buyers/buyers.service';
import { MockBuyersRepository } from '../buyers/testing/mock.buyers.repository';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
