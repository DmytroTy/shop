import { Controller, Body, Patch, Param } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto): Promise<UpdateResult> {
    return this.buyersService.update(+id, updateBuyerDto);
  }
}
