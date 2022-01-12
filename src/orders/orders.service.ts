import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne(id, { relations: ["ordersProducts"] });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<UpdateResult> {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.ordersRepository.softDelete(id);
  }
}
