import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrderProduct } from './order-product.entity';
import { OrdersProductsService } from './orders-products.service';
import { AddOrdersProductDto } from './dto/add-orders-product.dto';
// import { UpdateOrdersProductDto } from './dto/update-orders-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders-products')
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addProducts(@Body() addOrdersProductsDto: AddOrdersProductDto[]): Promise<OrderProduct[]> {
    return this.ordersProductsService.addProducts(addOrdersProductsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  findProducts(@Param('orderId') orderId: string): Promise<OrderProduct[]> {
    return this.ordersProductsService.findProducts(+orderId);
  }
}
