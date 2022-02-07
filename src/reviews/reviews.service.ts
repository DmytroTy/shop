import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
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

  async findByProductId(productId: number, options: IPaginationOptions): Promise<Pagination<Review>> {
    const queryBuilder = this.reviewsRepository
      .createQueryBuilder('review')
      .where("review.productId = :productId", { productId })
      .orderBy('review.id', 'DESC');

    return paginate<Review>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne(id);

    if (!review) throw new NotFoundException();

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number): Promise<UpdateResult> {
    const review = await this.reviewsRepository.findOne(id, { where: { buyer: { id: userId } } });
    if (review) {
      return this.reviewsRepository.update(id, updateReviewDto);
    }
    throw new ForbiddenException();
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.reviewsRepository.softDelete(id);
  }
}
