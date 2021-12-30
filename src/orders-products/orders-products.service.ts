import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { AddOrdersProductDto } from './dto/add-orders-product.dto';
// import { UpdateOrdersProductDto } from './dto/update-orders-product.dto';

@Injectable()
export class OrdersProductsService {
  constructor(
    @InjectRepository(OrderProduct)
    private ordersProductsRepository: Repository<OrderProduct>,
  ) {}

  async addProducts(addOrdersProductsDto: AddOrdersProductDto[]): Promise<OrderProduct[]> {
    return this.ordersProductsRepository.save(addOrdersProductsDto);
  }

  async findProducts(orderId: number): Promise<OrderProduct[]> {
    return this.ordersProductsRepository.find({ where: { orderId } });
  }
}
