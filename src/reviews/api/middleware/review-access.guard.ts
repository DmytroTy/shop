import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerWinston } from '../../../logger/logger-winston.service';
import { Review } from '../../review.entity';

@Injectable()
export class ReviewAccessGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerWinston,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { params, user } = context.switchToHttp().getRequest();
    const review = await this.reviewsRepository.findOne(params.id, { where: { buyer: { id: user.userId } } });

    if (!review) {
      this.logger.warn(`User error: user with id = ${user.userId} haven't access to review with id = ${params.id}`, 'ReviewAccessGuard');
    }

    return !!review;
  }
}
