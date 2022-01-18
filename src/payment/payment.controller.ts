import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('client_token')
  @ApiOkResponse({
    description: 'Get client token.',
    schema: {
      type: 'object',
      properties: {
        client_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  getClientToken(@Request() req) {
    return this.paymentService.createClientToken(req.user.userId);
  }

  @Post('checkout')
  @ApiOkResponse({
    description: 'Successfully checkout.',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        payment_method_nonce: {
          type: 'string',
        },
      },
    },
  })
  async checkout(@Body() body) { // @Request() req req.user
    return this.paymentService.sale(body.payment_method_nonce);
  }
}
