import { BraintreeGateway, Environment } from 'braintree';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Status } from '../enums/status.enum';
import { LoggerWinston } from '../logger/logger-winston.service';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class PaymentService {
  constructor(
    private connection: Connection,
    private readonly configService: ConfigService,
    private readonly logger: LoggerWinston,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  private braintreeGateway: BraintreeGateway;

  gateway(): BraintreeGateway {
    if (!this.braintreeGateway) {
      this.braintreeGateway = new BraintreeGateway({
        environment: 
          this.configService.get<string>('NODE_ENV') === 'development'
            ? Environment.Sandbox
            : Environment.Live,
        merchantId: this.configService.get<string>('BRAINTREE_MERCHANT_ID'),
        publicKey: this.configService.get<string>('BRAINTREE_PUBLIC_KEY'),
        privateKey: this.configService.get<string>('BRAINTREE_PRIVATE_KEY'),
      });
    }
    return this.braintreeGateway;
  }

  async createClientToken({ userId, email }) {
    const payment = await this.paymentsRepository.findOne({
      where: { buyer: { id: userId } },
      order: { id: 'DESC' },
    });

    try {
      let customerId: string;
      if (payment) {
        customerId = payment.customerId;
      } else {
        ({ customer: { id: customerId } } = await this.gateway().customer.create({
          // firstName,
          // lastName,
          email,
        }));
      }

      const { clientToken } = await this.gateway().clientToken.generate({ customerId });
      return { clientToken };
    } catch (err) {
      this.logger.error(`Important error: ${err.message}`, 'PaymentService', err);
      throw new InternalServerErrorException('Something went wrong with Braintree service creating customer or token, please try again later.');
    }
  }

  async sale({ paymentMethodNonce, clientDeviceData, orderProducts }, userId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let transactionId: string;

    try {
      let totalSum = 0;

      for (const productOrder of orderProducts) {
        const productDB = await this.productsRepository.findOne(productOrder.id);

        if (productOrder.quantity <= productDB.quantity) {
          await queryRunner.manager.decrement(Product, { id: productOrder.id }, 'quantity', productOrder.quantity);

          totalSum += productOrder.quantity * productDB.price;

          productOrder.type = productDB.type;
          productOrder.color = productDB.color;
          productOrder.price = productDB.price;
        } else {
          throw new BadRequestException('Not enough actually products quantity!');
        }
      }

      const order = await queryRunner.manager.save(Order, {
        buyer: { id: userId },
        orderProducts,
      });

      const payment = await this.paymentsRepository.findOne({
        where: { buyer: { id: userId } },
        order: { id: 'DESC' },
      });

      const { message, success, transaction } = await this.gateway().transaction.sale({
        amount: totalSum.toString(),
        orderId: order.id.toString(),
        paymentMethodNonce,
        customerId: payment ? payment.customerId : null,
        deviceData: clientDeviceData,
        options: {
          submitForSettlement: true,
          storeInVaultOnSuccess: true,
        }
      });

      if (!success) {
        for (const productOrder of orderProducts) {
          await queryRunner.manager.increment(Product, { id: productOrder.id }, 'quantity', productOrder.quantity);
        }
        order.status = Status.CANCELED;
        await queryRunner.manager.update(Order, order.id, order);

        throw new BadRequestException(message);
      }

      transactionId = transaction.id;

      order.status = Status.PROCESSED;
      await queryRunner.manager.update(Order, order.id, order);

      await queryRunner.manager.save(Payment, {
        customerId: transaction.customer.id,
        transactionId,
        buyer: { id: userId },
        order: order,
      });

      await queryRunner.commitTransaction();

      return { success };

    } catch (err) {
      // since we have errors lets rollback the changes we made
      if (transactionId) {
        await this.gateway().transaction.void(transactionId);
      }

      await queryRunner.rollbackTransaction();

      if (err instanceof BadRequestException) {
        this.logger.warn(`User error: ${err.message}`, 'PaymentService');
        throw err;
      }

      this.logger.error(`Important error: ${err.message}`, 'PaymentService', err);
      throw new InternalServerErrorException('Something went wrong with Braintree service method "sale", please try again later!');
    } finally {
      await queryRunner.release();
    }
  }
}
