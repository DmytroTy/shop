import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OrderProduct } from './order-product.entity';
import { OrdersProductsService } from './orders-products.service';
import { AddOrdersProductDto } from './dto/add-orders-product.dto';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders-products')
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record of orders products has been successfully created.',
    type: OrderProduct,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  @ApiBody({ type: [AddOrdersProductDto] })
  addProducts(@Body() addOrdersProductsDto: AddOrdersProductDto[]): Promise<OrderProduct[]> {
    return this.ordersProductsService.addProducts(addOrdersProductsDto);
  }
}
