import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
      buyer: { id: userId },
      orderProducts: addOrderProductsDto,
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

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<UpdateResult> {
    const order = await this.ordersRepository.findOne(id, { where: { buyer: { id: userId } } });
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
