import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { SkipAuth } from '../decorators/skip-auth.decorator';

@ApiTags('products')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @SkipAuth()
  @Get()
  @ApiOkResponse({
    description: 'Get all products.',
    type: Pagination,
  })
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

  @SkipAuth()
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
