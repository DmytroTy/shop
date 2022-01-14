import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
import { MockBuyerRepository } from './testing/mock.buyer.repository';

describe('BuyersService', () => {
  let service: BuyersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyersService,
        {
          provide: getRepositoryToken(Buyer),
          useClass: MockBuyerRepository,
        },
      ],
    }).compile();

    service = module.get<BuyersService>(BuyersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
