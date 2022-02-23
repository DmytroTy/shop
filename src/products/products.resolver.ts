import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Args, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AddReviewsInterceptor } from './api/middleware/add-reviews.interceptor';
import { SkipAuth } from '../decorators/skip-auth.decorator';
import { PaginationArgs } from '../dto/pagination.args';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { Paginated } from '../types/paginated.type';

@ObjectType()
class PaginatedProduct extends Paginated(Product) {}

@Resolver(/* of => Product */)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @SkipAuth()
  @Query(returns => PaginatedProduct, { nullable: true })
  products(@Args() paginationArgs: PaginationArgs): Promise<Pagination<Product>> {
    // limit = limit > 100 ? 100 : limit;
    return this.productsService.findAll({
      ...paginationArgs,
      route: '/products',
    });
  }

  @SkipAuth()
  @Query(returns => Product, { nullable: true })
  @UseInterceptors(AddReviewsInterceptor)
  product(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
