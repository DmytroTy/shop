import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CheckoutInput } from './dto/checkout.input';
import { PaymentService } from './payment.service';

@ObjectType({ description: 'Client token response' })
class ClientTokenResult {
  @Field()
  clientToken: string;
}

@ObjectType({ description: 'Checkout response' })
class CheckoutResult {
  @Field()
  success: boolean;
}

@Resolver()
@UseGuards(GqlJwtAuthGuard)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Query(returns => ClientTokenResult)
  getClientToken(@CurrentUser() user) {
    return this.paymentService.createClientToken(user);
  }

  @Mutation(returns => CheckoutResult)
  checkout(@Args('checkoutData') checkoutData: CheckoutInput, @CurrentUser() user) {
    return this.paymentService.sale(checkoutData, user.userId);
  }
}
