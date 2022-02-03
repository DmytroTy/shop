import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Repository, UpdateResult } from 'typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly logger: LoggerWinston,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(products: Product[], userId: number): Promise<Order> {
    return this.ordersRepository.save({
      buyer: { id: userId },
      orderProducts: products,
    });
  }

  async findAll(userId: number, query: PaginateQuery): Promise<Paginated<Order>> {
    return paginate(query, this.ordersRepository, {
      sortableColumns: ['id', 'status'],
      searchableColumns: ['status', 'orderProducts'],
      defaultSortBy: [['id', 'DESC']],
      where: { buyer: { id: userId } },
    });
      // select: ["id", "status", "orderProducts"]
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne(id, {
      select: ["id", "status", "orderProducts"],
      where: { buyer: { id: userId } },
    });

    if (!order) {
      this.logger.warn(`User error: Order with id = ${id} not found.`, 'OrdersService');
      throw new NotFoundException();
    }

    return order;
  }

  async update(id: number, updateOrder: Order): Promise<UpdateResult> {
    return this.ordersRepository.update(id, updateOrder);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.ordersRepository.softDelete(id);
  }
}
