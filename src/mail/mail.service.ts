import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { Buyer } from '../buyers/buyer.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
  ) {}

  async sendUserNotification(userID: number, products: [Product], totalSum: number) {
    const buyer = await this.buyersRepository.findOne(userID);

    await this.mailerService.sendMail({
      to: buyer.email,
      subject: 'You have made a successful purchase',
      text: `Hey ${buyer.username},\nYou successfully bought in our store products for the total amount: $${totalSum}`,
      template: 'notification',
      context: {
        name: buyer.username,
        products,
        totalSum,
      },
    });
  }

  async sendUserErrorNotification(userID: number, message: string) {
    const buyer = await this.buyersRepository.findOne(userID);

    await this.mailerService.sendMail({
      to: buyer.email,
      subject: 'You made an unsuccessful purchase',
      text: `Hey ${buyer.username},\nYou have unsuccessfully bought in our store!\nReason: ${message}`,
      template: 'error-notification',
      context: {
        name: buyer.username,
        message,
      },
    });
  }
}
