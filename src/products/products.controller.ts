import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AddReviewsInterceptor } from './api/middleware/add-reviews.interceptor';
import { PaginatedProduct, Product } from './product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all products.',
    type: PaginatedProduct,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productsService.findAll({
      page,
      limit,
      route: '/products',
    });
  }

  @Get(':id')
  @UseInterceptors(AddReviewsInterceptor)
  @ApiOkResponse({
    description: 'Get product by id.',
    type: Product,
  })
  @ApiNotFoundResponse({ description: 'No record with this ID found!' })
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
