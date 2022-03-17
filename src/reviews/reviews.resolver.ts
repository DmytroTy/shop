import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ReviewAccessGuard } from './api/middleware/review-access.guard';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { PaginationArgs } from '../dto/pagination.args';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewInput } from './dto/update-review.input';
import { Paginated } from '../types/paginated.type';

@ObjectType()
export class PaginatedReview extends Paginated(Review) {}

@Resolver(/* of => Review */)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(returns => Review)
  createReview(@Args('createReviewData') createReviewData: CreateReviewDto, @CurrentUser() user): Promise<Review> {
    return this.reviewsService.create(createReviewData, user.userId);
  }

  @Query(returns => PaginatedReview, { nullable: true })
  reviews(
    @Args('productId', { type: () => Int }) productId: number,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<Pagination<Review>> {
    return this.reviewsService.findByProductId(productId, paginationArgs);
  }

  @Query(returns => Review, { nullable: true })
  review(@Args('id', { type: () => Int }) id: number): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(ReviewAccessGuard)
  @UseGuards(GqlJwtAuthGuard)
  @Mutation(returns => Review)
  updateReview(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateReviewData') updateReviewData: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.update(id, updateReviewData);
  }
}
