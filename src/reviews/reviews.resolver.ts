import { Request, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { ReviewAccessGuard } from './api/middleware/review-access.guard';
import { PaginationArgs } from '../dto/pagination.args';
import { SkipAuth } from '../decorators/skip-auth.decorator';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(/* of => Review */)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(returns => Review)
  // @ApiBearerAuth()
  createReview(@Args('createReviewData') createReviewData: CreateReviewDto, @Request() req): Promise<Review> {
    return this.reviewsService.create(createReviewData, req.user.userId);
  }

  @SkipAuth()
  @Query(returns => [Review], { nullable: true })
  reviews(
    @Args('productId', { type: () => Int }) productId: number,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<Pagination<Review>> {
    // limit = limit > 100 ? 100 : limit;
    return this.reviewsService.findByProductId(productId, {
      ...paginationArgs,
      route: '/reviews?productId=' + productId,
    });
  }

  @SkipAuth()
  @Query(returns => Review, { nullable: true })
  review(@Args('id', { type: () => Int }) id: number): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(ReviewAccessGuard)
  @Mutation(returns => Review)
  // @ApiBearerAuth()
  updateReview(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateReviewData') updateReviewData: UpdateReviewInput,
  ): Promise<UpdateResult> {
    return this.reviewsService.update(id, updateReviewData);
  }
}
