import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { SkipAuth } from '../decorators/skip-auth.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @SkipAuth()
  @Get()
  @ApiOkResponse({
    description: 'Get all products.',
    type: [Product],
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
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
