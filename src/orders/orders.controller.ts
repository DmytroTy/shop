import { Controller, Get, Post, Body, Patch, Param, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { AddOrderProductDto } from './dto/add-order-product.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record a new order has been successfully created.',
    type: Order,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  @ApiBody({ type: [AddOrderProductDto] })
  create(@Body() addOrderProductsDto: AddOrderProductDto[], @Request() req): Promise<Order> {
    return this.ordersService.create(addOrderProductsDto, req.userId);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all orders.',
    type: [Order],
  })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get order by id.',
    type: Order,
  })
  @ApiNotFoundResponse({ description: 'No record of order with this ID found!' })
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/:action')
  @ApiAcceptedResponse({
    description: 'The record of order has been successfully updated.',
    type: Order,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<UpdateResult> {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
