import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReviewsService } from '../../../reviews/reviews.service';

@Injectable()
export class AddReviewsInterceptor implements NestInterceptor {
  constructor(private readonly reviewsService: ReviewsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    let id: number;
    const request = context.switchToHttp().getRequest();
    if (request) {
      ({ params: { id } } = request);
    } else {
      ({ id } = GqlExecutionContext.create(context).getArgs());
    }
    const reviews = await this.reviewsService.findByProductId(id, {
      page: 1,
      limit: 10,
      route: '/reviews?productId=' + id,
    });

    return next
      .handle()
      .pipe(map(value => {
        value.reviews = reviews;
        return value;
      }));
  }
}
