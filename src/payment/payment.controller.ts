import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('client-token')
  @ApiOkResponse({
    description: 'Get client token.',
    schema: {
      type: 'object',
      properties: {
        clientToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized forbidden!' })
  getClientToken(@Request() req) {
    return this.paymentService.createClientToken(req.user);
  }

  @Post('checkout')
  @ApiCreatedResponse({
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
  @ApiBadRequestResponse({ description: 'Bad request!' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentMethodNonce: {
          type: 'string',
        },
        clientDeviceData: {
          type: 'string',
        },
        orderProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              quantity: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  })
  async checkout(@Body() body, @Request() req) {
    return this.paymentService.sale(body, req.user.userId);
  }
}
