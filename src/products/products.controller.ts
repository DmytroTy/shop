import { Controller, Get, Param } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { SkipAuth } from '../skip-auth.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @SkipAuth()
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }
}
