import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.save(createOrderDto);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<UpdateResult> {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.ordersRepository.update(id, { deletedAt: new Date() });
  }
}
