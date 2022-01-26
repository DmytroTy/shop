import { BraintreeGateway, Environment } from 'braintree';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Status } from '../enums/status.enum';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class PaymentService {
  constructor(
    private connection: Connection,
    private readonly configService: ConfigService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {
    this.gateway = new BraintreeGateway({
      environment: 
        this.configService.get<string>('NODE_ENV') === 'development'
          ? Environment.Sandbox
          : Environment.Live,
      merchantId: this.configService.get<string>('BRAINTREE_MERCHANT_ID'),
      publicKey: this.configService.get<string>('BRAINTREE_PUBLIC_KEY'),
      privateKey: this.configService.get<string>('BRAINTREE_PRIVATE_KEY'),
    });
  }

  private readonly gateway: BraintreeGateway; 

  async createClientToken({ userId, email }) {
    const payment = await this.paymentsRepository.findOne({
      where: { buyer: { id: userId } },
      order: { id: 'DESC' },
    });

    let customerId: string;
    if (payment) customerId = payment.customerId;
    else {
      ({ customer: { id: customerId } } = await this.gateway.customer.create({
        // firstName: "Jen",
        // lastName: "Smith",
        email,
      }));
    }
    console.log(customerId);

    const { clientToken } = await this.gateway.clientToken.generate({ customerId });
    return { clientToken };
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
          queryRunner.manager.decrement(Product, { id: productOrder.id }, 'quantity', productOrder.quantity);
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

      const { message, success, transaction } = await this.gateway.transaction.sale({
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
        orderProducts.forEach(productOrder => {
          queryRunner.manager.increment(Product, { id: productOrder.id }, 'quantity', productOrder.quantity);
        });
        order.status = Status.CANCELED;
        queryRunner.manager.update(Order, order.id, order);

        throw new BadRequestException(message);
      }

      transactionId = transaction.id;

      order.status = Status.PROCESSED;
      await queryRunner.manager.update(Order, order.id, order);

      await queryRunner.manager.save(Payment, {
        customerId: transaction.customer.id,
        transactionId: transaction.id,
        buyer: { id: userId },
        order: order,
      });

      await queryRunner.commitTransaction();

      return { success };

    } catch (err) {
      // since we have errors lets rollback the changes we made
      await this.gateway.transaction.void(transactionId);

      await queryRunner.rollbackTransaction();

      if (err instanceof BadRequestException) {
        throw err;
      } else {
        console.log(err.message);
        throw new InternalServerErrorException('Something went wrong, please try again later!');
      }
    } finally {
      await queryRunner.release();
    }
  }
}
