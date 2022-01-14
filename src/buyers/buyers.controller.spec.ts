import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Buyer } from './buyer.entity';
import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';
import { MockBuyerRepository } from './testing/mock.buyer.repository';

describe('BuyersController', () => {
  let controller: BuyersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyersController],
      providers: [
        BuyersService,
        {
          provide: getRepositoryToken(Buyer),
          useClass: MockBuyerRepository,
        },
      ],
    }).compile();

    controller = module.get<BuyersController>(BuyersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
