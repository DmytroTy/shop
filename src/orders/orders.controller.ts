import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all orders.',
    type: [Order],
  })
  findAll(@Request() req): Promise<Order[]> {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get order by id.',
    type: Order,
  })
  @ApiNotFoundResponse({ description: 'No record of order with this ID found!' })
  findOne(@Param('id') id: string, @Request() req): Promise<Order> {
    return this.ordersService.findOne(+id, req.user.userId);
  }
}
