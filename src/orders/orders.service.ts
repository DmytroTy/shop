import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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
    return this.ordersRepository.create(createOrderDto);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.ordersRepository.delete(id);
  }
}
