import { Get, Req, Post, HttpStatus, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { Buyer } from './buyers/buyer.entity';
import { CreateBuyerDto } from './buyers/dto/create-buyer.dto';
import { BuyersService } from './buyers/buyers.service';

@Resolver()
export class AppResolver {
  constructor(
    private authService: AuthService,
    private buyersService: BuyersService,
  ) {}

  /* @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  } */

  @SkipAuth()
  @Mutation(returns => Buyer)
  @UseInterceptors(ClassSerializerInterceptor)
  // @HttpCode(HttpStatus.CREATED)
  register(@Args('createBuyerDto') createBuyerDto: CreateBuyerDto) {
    return this.authService.register(createBuyerDto);
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

  // @ApiBearerAuth()
  @Query(returns => Buyer, { name: 'profile' })
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@Req() req): Promise<Buyer> {
    return this.buyersService.findOne(req.user.email);
  }
}
