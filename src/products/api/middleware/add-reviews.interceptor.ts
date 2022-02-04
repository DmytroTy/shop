import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReviewsService } from '../../../reviews/reviews.service';

@Injectable()
export class AddReviewsInterceptor implements NestInterceptor {
  constructor(private readonly reviewsService: ReviewsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { params: { id }, protocol, headers: { host } } = context.switchToHttp().getRequest();
    const reviews = await this.reviewsService.findByProductId(+id, {
      page: undefined,
      limit: undefined,
      sortBy: undefined,
      search: undefined,
      searchBy: undefined,
      filter: undefined,
      path: protocol + '://' + host + '/reviews',
    });

    return next
      .handle()
      .pipe(map(value => {
        value.reviews = reviews;
        return value;
      }));
  }
}
