import { Controller, Body, Get, Request, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { CreateBuyerDto } from './buyers/dto/create-buyer.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

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
    return this.authService.register(createBuyerDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
