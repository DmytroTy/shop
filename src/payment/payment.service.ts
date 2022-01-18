import { BraintreeGateway, Environment } from 'braintree';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
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
    const customerId = await this.paymentsRepository.findOne({
      where: { buyer: { id: userId } },
      order: { id: 'DESC' },
    });
    const { clientToken } = await this.gateway.clientToken.generate(customerId ? { customerId } : {});
    return { client_token: clientToken };
  }

  async sale(nonceFromTheClient) {
    const { success } = await this.gateway.transaction.sale({
      amount: "10.00",
      paymentMethodNonce: nonceFromTheClient,
      // deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true
      }
    });

    // if (!success) throw new 

    return { success };
  }
}
