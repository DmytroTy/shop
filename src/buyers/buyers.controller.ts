import { Body, Controller, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@ApiTags('buyers')
@ApiBearerAuth()
@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    description: 'The record of buyer has been successfully updated.',
    type: Buyer,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  update(@Param('id') id: number, @Body() updateBuyerDto: UpdateBuyerDto, @Request() req): Promise<Buyer> {
    return this.buyersService.update(id, updateBuyerDto, req.user.userId);
  }
}
