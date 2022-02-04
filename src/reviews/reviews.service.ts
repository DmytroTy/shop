import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Repository, UpdateResult } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
    return this.reviewsRepository.save({
      buyer: { id: userId },
      ...createReviewDto,
    });
  }

  async findByProductId(productId: number, query: PaginateQuery): Promise<Paginated<Review>> {
    return paginate(query, this.reviewsRepository, {
      sortableColumns: ['id', 'rating'],
      searchableColumns: ['rating', 'buyer', 'comment'],
      defaultSortBy: [['id', 'DESC']],
      where: { product: { id: productId } },
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne(id);

    if (!review) throw new NotFoundException();

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<UpdateResult> {
    return this.reviewsRepository.update(id, updateReviewDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.reviewsRepository.softDelete(id);
  }
}
