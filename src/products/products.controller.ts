import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddReviewsInterceptor } from './api/middleware/add-reviews.interceptor';
import { SkipAuth } from '../decorators/skip-auth.decorator';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @SkipAuth()
  @Get()
  @ApiOkResponse({
    description: 'Get all products.',
    type: Paginated,
  })
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productsService.findAll(query);
  }

  @SkipAuth()
  @UseInterceptors(AddReviewsInterceptor)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get product by id.',
    type: Product,
  })
  @ApiNotFoundResponse({ description: 'No record with this ID found!' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }
}
