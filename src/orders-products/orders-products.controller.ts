import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderProduct } from './order-product.entity';
import { OrdersProductsService } from './orders-products.service';
import { AddOrdersProductDto } from './dto/add-orders-product.dto';
// import { UpdateOrdersProductDto } from './dto/update-orders-product.dto';

@Controller('orders-products')
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addProducts(@Body() addOrdersProductDto: AddOrdersProductDto): Promise<OrderProduct> {
    return this.ordersProductsService.addProducts(addOrdersProductDto);
  }

  @Get(':orderId')
  findProducts(@Param('orderId') orderId: string): Promise<OrderProduct> {
    return this.ordersProductsService.findProducts(+orderId);
  }
}
