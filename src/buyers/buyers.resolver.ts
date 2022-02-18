import { Request } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateResult } from 'typeorm';
import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
import { UpdateBuyerInput } from './dto/update-buyer.input';

@Resolver(/* of => Buyer */)
// @ApiBearerAuth()
export class BuyersResolver {
  constructor(private readonly buyersService: BuyersService) {}

  @Mutation(returns => Buyer)
  updateBuyer(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateBuyerData') updateBuyerData: UpdateBuyerInput,
    @Request() req,
  ): Promise<UpdateResult> {
    return this.buyersService.update(id, updateBuyerData, req.user.userId);
  }
}
