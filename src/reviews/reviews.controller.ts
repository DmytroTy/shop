import { Controller, Get, Post, Body, Patch, Param, Request, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SkipAuth } from '../decorators/skip-auth.decorator';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The record of new review has been successfully created.',
    type: Review,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @SkipAuth()
  @Get()
  @ApiOkResponse({
    description: 'Get reviews by productId.',
    type: Pagination,
  })
  findByProductId(
    @Query('productId') productId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Review>> {
    limit = limit > 100 ? 100 : limit;
    return this.reviewsService.findByProductId(+productId, {
      page,
      limit,
      route: '/reviews?productId=' + productId,
    });
  }

  @SkipAuth()
  @Get(':id')
  @ApiOkResponse({
    description: 'Get product by id.',
    type: Review,
  })
  @ApiNotFoundResponse({ description: 'No record with this ID found!' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record of review has been successfully updated.',
    type: Review,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  @ApiForbiddenResponse({ description: 'Forbidden!'})
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req) {
    return this.reviewsService.update(+id, updateReviewDto, req.user.userId);
  }
}
