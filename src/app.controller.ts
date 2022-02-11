import { Controller, Body, Get, Request, Post, HttpCode, HttpStatus, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
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
  @UseInterceptors(ClassSerializerInterceptor) // Not work here!
  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record of new buyer has been successfully created.',
    type: Buyer,
  })
  @ApiConflictResponse({ description: 'A user with this email already exists!' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create user account.' })
  async register(@Body() createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.authService.register(createBuyerDto);
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  @ApiOkResponse({
    description: 'Get profile.',
    type: Buyer,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  async getProfile(@Request() req): Promise<Buyer> {
    return this.buyersService.findOne(req.user.email);
  }
}
