import { Req, HttpStatus, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
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

  /* @SkipAuth()
  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @SkipAuth()
  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return this.authService.facebookLogin(req.user);
  } */

  @UseGuards(GqlJwtAuthGuard)
  @Query(returns => Buyer, { name: 'profile' })
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@CurrentUser() user: Buyer): Promise<Buyer> {
    return this.buyersService.findOne(user.email);
  }
}
