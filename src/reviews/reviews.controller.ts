import { ReviewAccessGuard } from './api/middleware/review-access.guard';
import { Controller, Get, Post, Body, Patch, Param, Request, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginatedReview, Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The record of new review has been successfully created.',
    type: Review,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req): Promise<Review> {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get reviews by productId.',
    type: PaginatedReview,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findByProductId(
    @Query('productId') productId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Review>> {
    limit = limit > 100 ? 100 : limit;
    return this.reviewsService.findByProductId(productId, {
      page,
      limit,
      route: '/reviews?productId=' + productId,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get product by id.',
    type: Review,
  })
  @ApiNotFoundResponse({ description: 'No record with this ID found!' })
  findOne(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(ReviewAccessGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record of review has been successfully updated.',
    type: Review,
  })
  @ApiBadRequestResponse({ description: 'Bad Request!'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  @ApiForbiddenResponse({ description: 'Forbidden!'})
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.update(id, updateReviewDto);
  }
}
