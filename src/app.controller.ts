import { Controller, Body, Get, Request, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { Buyer } from './buyers/buyer.entity';
import { CreateBuyerDto } from './buyers/dto/create-buyer.dto';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOkResponse({
    description: 'User successfully logined.',
    schema: {
      type: 'object',
      properties: {
        access_token: {
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
  // @ApiConflictResponse({ description: 'A user with this email already exists!' })
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
  getProfile(@Request() req) {
    return req.user;
  }
}
