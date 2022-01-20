import { BraintreeGateway, Environment } from 'braintree';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Status } from '../enums/status.enum';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {
    this.gateway = new BraintreeGateway({
      environment: 
        this.configService.get<string>('NODE_ENV') == 'development'
          ? Environment.Sandbox
          : Environment.Live,
      merchantId: this.configService.get<string>('BRAINTREE_MERCHANT_ID'),
      publicKey: this.configService.get<string>('BRAINTREE_PUBLIC_KEY'),
      privateKey: this.configService.get<string>('BRAINTREE_PRIVATE_KEY'),
    });
  }

  private readonly gateway: BraintreeGateway; 

  async createClientToken(userId: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { buyer: { id: userId } },
      order: { id: 'DESC' },
    });
    const { clientToken } = await this.gateway.clientToken.generate(payment ? { customerId: payment.customerId } : {});
    return { clientToken };
  }

  async sale({ paymentMethodNonce, clientDeviceData, orderProducts }, userId: number) {
    let totalSum = 0;
    for (const productOrder of orderProducts) {
      const productDB = await this.productsRepository.findOne(productOrder.id);
      if (productOrder.quantity <= productDB.quantity) {
        this.productsRepository.decrement({ id: productOrder.id }, 'quantity', productOrder.quantity);
        totalSum += productOrder.quantity * productDB.price;
        productOrder.type = productDB.type;
        productOrder.color = productDB.color;
        productOrder.price = productDB.price;
      } else {
        throw new BadRequestException('Not enough actually products quantity!');
      }
    }

    const order = await this.ordersService.create(orderProducts, userId);

    const { message, success, transaction } = await this.gateway.transaction.sale({
      amount: totalSum.toString(),
      // Currency is determined by merchant account ID.
      orderId: order.id.toString(),
      paymentMethodNonce,
      deviceData: clientDeviceData,
      options: {
        submitForSettlement: true,
      }
    });

    if (!success) {
      orderProducts.forEach(productOrder => {
        this.productsRepository.increment({ id: productOrder.id }, 'quantity', productOrder.quantity);
      });
      order.status = Status.CANCELED;
      this.ordersService.update(order.id, order);
      throw new BadRequestException(message);
    }

    order.status = Status.PROCESSED;
    this.ordersService.update(order.id, order);

    this.paymentsRepository.save({
      customerId: transaction.customer.id,
      transactionId: transaction.id,
      buyer: { id: userId },
      order: order,
    });

    return { success };
  }
}
