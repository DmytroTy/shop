import { Controller, Body, Get, Req, Post, HttpCode, HttpStatus, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
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
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record of new buyer has been successfully created.',
    type: Buyer,
  })
  @ApiConflictResponse({ description: 'A user with this email already exists!' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create user account.' })
  async register(@Body() createBuyerDto: CreateBuyerDto) {
    return this.authService.register(createBuyerDto);
  }

  @UseGuards(AuthGuard("facebook"))
  @Get("/facebook")
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @UseGuards(AuthGuard("facebook"))
  @Get("/facebook/redirect")
  @ApiCreatedResponse({
    description: 'User successfully logined by facebook.',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return this.authService.facebookLogin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get profile.',
    type: Buyer,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  async getProfile(@Req() req): Promise<Buyer> {
    return this.buyersService.findOne(req.user.email);
  }
}
