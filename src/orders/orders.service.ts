import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { AddOrderProductDto } from './dto/add-order-product.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(addOrderProductsDto: AddOrderProductDto[], userId: number): Promise<Order> {
    return this.ordersRepository.save({
      buyerId: userId,
      orderProducts: addOrderProductsDto,
    });
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({ where: { buyerId: userId } });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    return this.ordersRepository.findOne(id, { where: { buyerId: userId } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<UpdateResult> {
    const order = await this.ordersRepository.findOne(id, { where: { buyerId: userId } });
    if (order) {
      return this.ordersRepository.update(id, updateOrderDto);
    } else {
      throw new ForbiddenException();
    }
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.ordersRepository.softDelete(id);
  }
}
