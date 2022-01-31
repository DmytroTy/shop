import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { MockReviewsRepository } from './testing/mock.reviews.repository';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useClass: MockReviewsRepository,
        },
      ],
    }).compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
  });

  it('reviewsService should be defined', () => {
    expect(reviewsService).toBeDefined();
  });
});
