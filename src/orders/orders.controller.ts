import { Controller, Get, Post, Body, Patch, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/:action')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<UpdateResult> {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
