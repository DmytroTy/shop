import { Controller, Body, Patch, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
// import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
// import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  /* @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.buyersService.create(createBuyerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Buyer> {
    return this.buyersService.findOne(+id);
  } */

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto): Promise<UpdateResult> {
    return this.buyersService.update(+id, updateBuyerDto);
  }

  /* @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<UpdateResult> {
    return this.buyersService.remove(+id);
  } */
}
