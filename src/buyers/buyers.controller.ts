import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto): Promise<UpdateResult> {
    return this.buyersService.update(+id, updateBuyerDto);
  }
}
