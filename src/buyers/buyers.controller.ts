import { Body, Controller, Param, Patch, Request } from '@nestjs/common';
import { ApiOkResponse, ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@ApiTags('buyers')
@ApiBearerAuth()
@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Patch(':id')
  @ApiOkResponse({
    description: 'The record of buyer has been successfully updated.',
    type: Buyer,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto, @Request() req): Promise<UpdateResult> {
    return this.buyersService.update(+id, updateBuyerDto, req.user.userId);
  }
}
