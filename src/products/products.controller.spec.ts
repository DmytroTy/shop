import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MockProductRepository } from './testing/mock.product.repository';
import { Review } from '../reviews/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { MockReviewsRepository } from '../reviews/testing/mock.reviews.repository';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ConfigService,
        LoggerWinston,
        ProductsService,
        ReviewsService,
        {
          provide: getRepositoryToken(Product),
          useClass: MockProductRepository,
        },
        {
          provide: getRepositoryToken(Review),
          useClass: MockReviewsRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
