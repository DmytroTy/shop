import { BraintreeGateway, Environment } from 'braintree';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { Product } from '../products/product.entity';
import { MockProductRepository } from '../products/testing/mock.product.repository';
import { MockConnection } from '../testing/mock.connection';
import { MockPaymentsRepository } from './testing/mock.payments.repository';
import { MockBraintreeGateway } from '../testing/mock.braintree.gateway';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        PaymentService,
        {
          provide: Connection,
          useClass: MockConnection,
        },
        // ConfigService,
        Environment,
        {
          provide: getRepositoryToken(Product),
          useClass: MockProductRepository,
        },
        {
          provide: getRepositoryToken(Payment),
          useClass: MockPaymentsRepository,
        },
        {
          provide: BraintreeGateway,
          useClass: MockBraintreeGateway,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
