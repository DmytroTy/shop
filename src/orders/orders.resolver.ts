import { ClassSerializerInterceptor, Request, UseInterceptors } from '@nestjs/common';
import { Args, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationArgs } from '../dto/pagination.args';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { Paginated } from '../types/paginated.type';

@ObjectType()
class PaginatedOrder extends Paginated(Order) {}

@Resolver(/* of => Order */)
// @ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(returns => PaginatedOrder, { nullable: true })
  orders(@Request() req, @Args() paginationArgs: PaginationArgs): Promise<Pagination<Order>> {
    // limit = limit > 100 ? 100 : limit;
    return this.ordersService.findAll(req.user.userId, {
      ...paginationArgs,
      route: '/orders',
    });
  }

  @Query(returns => Order, { nullable: true })
  order(@Args('id', { type: () => Int }) id: number, @Request() req): Promise<Order> {
    return this.ordersService.findOne(id, req.user.userId);
  }
}
