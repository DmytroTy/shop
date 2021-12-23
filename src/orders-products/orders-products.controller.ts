import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersProductsService } from './orders-products.service';
import { CreateOrdersProductDto } from './dto/create-orders-product.dto';
import { UpdateOrdersProductDto } from './dto/update-orders-product.dto';

@Controller('orders-products')
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @Post()
  add(@Body() createOrdersProductDto: CreateOrdersProductDto) {
    return this.ordersProductsService.add(createOrdersProductDto);
  }

  @Get(':id')
  findProducts(@Param('id') id: string) {
    return this.ordersProductsService.findProducts(+id);
  }
}
