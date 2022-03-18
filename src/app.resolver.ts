import { HttpStatus, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Args, Field, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { GqlJwtAuthGuard } from './auth/guards/gql-jwt-auth.guard';
import { GqlLocalAuthGuard } from './auth/guards/gql-local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Buyer } from './buyers/buyer.entity';
import { CreateBuyerDto } from './buyers/dto/create-buyer.dto';
import { BuyersService } from './buyers/buyers.service';
import { LoginInput } from './dto/login.input';

@ObjectType({ description: 'Success login response data' })
class LoginResult {
  @Field()
  accessToken: string;
}

@Resolver()
export class AppResolver {
  constructor(
    private authService: AuthService,
    private buyersService: BuyersService,
  ) {}

  @UseGuards(GqlLocalAuthGuard)
  @Mutation(returns => LoginResult)
  login(@Args('loginData') loginData: LoginInput,  @CurrentUser() user: Buyer) {
    // loginData is used only by GqlLocalAuthGuard but not directly in this method
    return this.authService.login(user);
  }

  @Mutation(returns => Buyer)
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Args('createBuyerData') createBuyerData: CreateBuyerDto) {
    return this.authService.register(createBuyerData);
  }

  /* @Query(returns => Int)
  @UseGuards(AuthGuard('facebook'))
  facebookLogin(): any {
    return HttpStatus.OK;
  }

  @Query(returns => LoginResult)
  @UseGuards(AuthGuard('facebook'))
  facebookLoginRedirect(@CurrentUser() user: Buyer): Promise<any> {
    return this.authService.facebookLogin(user);
  } */

  @UseGuards(GqlJwtAuthGuard)
  @Query(returns => Buyer, { name: 'profile' })
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@CurrentUser() user: Buyer): Promise<Buyer> {
    return this.buyersService.findOne(user.email);
  }
}
