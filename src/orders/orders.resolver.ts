import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PaginationArgs } from '../dto/pagination.args';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { Paginated } from '../types/paginated.type';

@ObjectType()
export class PaginatedOrder extends Paginated(Order) {}

@UseGuards(GqlJwtAuthGuard)
@Resolver()
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(returns => PaginatedOrder)
  orders(@CurrentUser() user, @Args() paginationArgs: PaginationArgs): Promise<Pagination<Order>> {
    return this.ordersService.findAll(user.userId, paginationArgs);
  }

  @Query(returns => Order)
  order(@Args('id', { type: () => Int }) id: number, @CurrentUser() user): Promise<Order> {
    return this.ordersService.findOne(id, user.userId);
  }
}
