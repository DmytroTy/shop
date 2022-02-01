import { Controller, Body, Get, Request, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { Buyer } from './buyers/buyer.entity';
import { CreateBuyerDto } from './buyers/dto/create-buyer.dto';
import { BuyersService } from './buyers/buyers.service';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private buyersService: BuyersService,
  ) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiCreatedResponse({
    description: 'User successfully logined.',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
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
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record new buyer has been successfully created.',
    type: Buyer,
  })
  @ApiConflictResponse({ description: 'A user with this email already exists!' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  async register(@Body() createBuyerDto: CreateBuyerDto) {
    return this.authService.register(createBuyerDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOkResponse({
    description: 'Get profile.',
    type: Buyer,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  async getProfile(@Request() req) {
    const user = await this.buyersService.findOne(req.user.email);
    delete user.password;
    return user;
  }
}
