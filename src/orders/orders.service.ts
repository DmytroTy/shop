import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(products: Product[], userId: number): Promise<Order> {
    return this.ordersRepository.save({
      buyer: { id: userId },
      orderProducts: products,
    });
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      select: ["id", "status", "orderProducts"],
      where: { buyer: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne(id, {
      select: ["id", "status", "orderProducts"],
      where: { buyer: { id: userId } },
    });

    if (!order) throw new NotFoundException();

    return order;
  }

  async update(id: number, updateOrder: Order): Promise<UpdateResult> {
    return this.ordersRepository.update(id, updateOrder);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.ordersRepository.softDelete(id);
  }
}
