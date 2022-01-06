import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrderProduct } from './order-product.entity';
import { OrdersProductsService } from './orders-products.service';
import { AddOrdersProductDto } from './dto/add-orders-product.dto';

@ApiBearerAuth()
@Controller('orders-products')
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addProducts(@Body() addOrdersProductsDto: AddOrdersProductDto[]): Promise<OrderProduct[]> {
    return this.ordersProductsService.addProducts(addOrdersProductsDto);
  }
}
