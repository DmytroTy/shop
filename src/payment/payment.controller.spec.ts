import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { MailService } from '../mail/mail.service';
import { Order } from '../orders/order.entity';
import { MockOrderRepository } from '../orders/testing/mock.order.repository';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { Product } from '../products/product.entity';
import { MockProductRepository } from '../products/testing/mock.product.repository';
import { MockConnection } from '../testing/mock.connection';
import { MockMailService } from './testing/mock.mail.service';
import { MockPaymentsRepository } from './testing/mock.payments.repository';

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
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

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
