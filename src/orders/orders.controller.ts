import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all orders.',
    type: Pagination,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordersService.findAll(req.user.userId, {
      page,
      limit,
      route: '/orders',
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get order by id.',
    type: Order,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  @ApiNotFoundResponse({ description: 'No record of order with this ID found!' })
  findOne(@Param('id') id: string, @Request() req): Promise<Order> {
    return this.ordersService.findOne(+id, req.user.userId);
  }
}
