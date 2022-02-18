import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { MailService } from '../mail/mail.service';
import { Order } from '../orders/order.entity';
import { MockOrderRepository } from '../orders/testing/mock.order.repository';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { Product } from '../products/product.entity';
import { MockProductRepository } from '../products/testing/mock.product.repository';
import { MockConnection } from '../testing/mock.connection';
import { MockMailService } from './testing/mock.mail.service';
import { MockPaymentsRepository } from './testing/mock.payments.repository';
import { MockBraintreeGateway } from '../testing/mock.braintree.gateway';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Connection,
          useClass: MockConnection,
        },
        ConfigService,
        LoggerWinston,
        {
          provide: MailService,
          useClass: MockMailService,
        },
        PaymentService,
        {
          provide: getRepositoryToken(Order),
          useClass: MockOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: MockProductRepository,
        },
        {
          provide: getRepositoryToken(Payment),
          useClass: MockPaymentsRepository,
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    paymentService.gateway = jest.fn().mockReturnValue(new MockBraintreeGateway());
  });

  it('paymentService should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  describe('createClientToken', () => {
    it('user have been passed - must return a object with field "clientToken"', async () => {
      const user = { userId: 1, email: 'test@test.com' };
      expect(await paymentService.createClientToken(user)).toHaveProperty('clientToken');
    });

    it('payment not found - must create customer and return a object with field "clientToken"', async () => {
      const user = { userId: 0, email: 'test@test.com' };
      const clientToken = await paymentService.createClientToken(user);
      expect(clientToken).toHaveProperty('clientToken');
      expect(paymentService.gateway).toHaveBeenCalledTimes(2);
    });
  });

  describe('sale', () => {
    it('a valid body and userId have been passed - must return a object with value of field "success" = true', async () => {
      const body = { paymentMethodNonce: 'valid-nonce', clientDeviceData: 'web', orderProducts: [{ id: 1, quantity: 2 }] };
      const userId = 1;
      expect(await paymentService.sale(body, userId)).toEqual({ success: true });
    });

    it('want to buy too much product - throws an error', async () => {
      const body = { paymentMethodNonce: 'valid-nonce', clientDeviceData: 'web', orderProducts: [{ id: 1, quantity: 20 }] };
      const userId = 1;
      const error = new BadRequestException('Not enough actually products quantity!');
      expect(paymentService.sale(body, userId)).rejects.toThrowError(error);
    });

    it('not successfull transaction for not valid nonce - throws an error', async () => {
      const body = { paymentMethodNonce: 'not-valid-nonce', clientDeviceData: 'web', orderProducts: [{ id: 1, quantity: 2 }] };
      const userId = 1;
      const error = new BadRequestException('message');
      expect(paymentService.sale(body, userId)).rejects.toThrowError(error);
    });
  });
});
