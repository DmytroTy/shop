import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let id, userId: number;
    const request = context.switchToHttp().getRequest();
    if (request) {
      ({ params: { id }, user: { userId } } = request);
    } else {
      const ctx = GqlExecutionContext.create(context);
      ({ id } = ctx.getArgs());
      ({ userId } = ctx.getContext().req.user);
    }
    const review = await this.reviewsRepository.findOne(id, { where: { buyer: { id: userId } } });

    if (!review) {
      this.logger.warn(`User error: user with id = ${userId} haven't access to review with id = ${id}`, 'ReviewAccessGuard');
    }

    return !!review;
  }
}
