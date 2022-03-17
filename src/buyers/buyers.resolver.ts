import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateBuyerInput } from './dto/update-buyer.input';

@Resolver(/* of => Buyer */)
@UseGuards(GqlJwtAuthGuard)
export class BuyersResolver {
  constructor(private readonly buyersService: BuyersService) {}

  @Mutation(returns => Buyer, { name: 'updateProfile' })
  updateBuyer(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateBuyerData') updateBuyerData: UpdateBuyerInput,
    @CurrentUser() user,
  ): Promise<Buyer> {
    return this.buyersService.update(id, updateBuyerData, user.userId);
  }
}
