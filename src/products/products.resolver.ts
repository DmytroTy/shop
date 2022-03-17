import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Args, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AddReviewsInterceptor } from './api/middleware/add-reviews.interceptor';
import { PaginationArgs } from '../dto/pagination.args';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { Paginated } from '../types/paginated.type';

@ObjectType()
class PaginatedProduct extends Paginated(Product) {}

@Resolver()
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(returns => PaginatedProduct)
  products(@Args() paginationArgs: PaginationArgs): Promise<Pagination<Product>> {
    return this.productsService.findAll(paginationArgs);
  }

  @Query(returns => Product)
  @UseInterceptors(AddReviewsInterceptor)
  product(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
