import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../review.entity';

@Injectable()
export class ReviewAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { params, user } = context.switchToHttp().getRequest();
    const review = await this.reviewsRepository.findOne(params.id, { where: { buyer: { id: user.userId } } });

    return !!review;
  }
}
