import { Controller, Body, Get, Request, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { BuyersService } from './buyers/buyers.service';
import { CreateBuyerDto } from './buyers/dto/create-buyer.dto';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private authService: AuthService, private buyersService: BuyersService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createBuyerDto: CreateBuyerDto) {
    const saltOrRounds = 10;
    const pass = createBuyerDto.password;
    createBuyerDto.password = await bcrypt.hash(pass, saltOrRounds);

    const buyer = await this.buyersService.create(createBuyerDto);
    const { password, deletedAt, ...result } = buyer;

    return result;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
