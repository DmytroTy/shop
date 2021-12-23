import { Injectable } from '@nestjs/common';
import { CreateOrdersProductDto } from './dto/create-orders-product.dto';

@Injectable()
export class OrdersProductsService {
  add(createOrdersProductDto: CreateOrdersProductDto) {
    return 'This action adds a new ordersProduct';
  }

  findProducts(id: number) {
    return `This action returns a #${id} ordersProducts`;
  }
}
