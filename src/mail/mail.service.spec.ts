import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Buyer } from '../buyers/buyer.entity';
import { MockBuyersRepository } from '../buyers/testing/mock.buyers.repository';
import { MailService } from './mail.service';
import { MockMailerService } from './testing/mock.mailer.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailerService,
          useClass: MockMailerService,
        },
        MailService,
        {
          provide: getRepositoryToken(Buyer),
          useClass: MockBuyersRepository,
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
    mailerService.sendMail = jest.fn();
  });

  it('mailService should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendUserNotification', () => {
    it('userId, products and totalSum have been passed - must sent e-mail', async () => {
      const userId = 1;
      const products = [{
        id: 1,
        type: 'hat',
        color: 'red',
        price: 12.3,
        quantity: 1,
      }];
      const totalSum = 12.3;

      await mailService.sendUserNotification(userId, products, totalSum);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'test@test.com',
        subject: 'You have made a successful purchase',
        text: `Hey test,\nYou successfully bought in our store products for the total amount: $${totalSum}`,
        template: 'notification',
        context: {
          name: 'test',
          products,
          totalSum,
        },
      });
    });
  });

  describe('sendUserErrorNotification', () => {
    it('userId and message have been passed - must sent e-mail', async () => {
      const userId = 1;
      const message = 'Error detailed description.';

      await mailService.sendUserErrorNotification(userId, message);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'test@test.com',
        subject: 'You made an unsuccessful purchase',
        text: `Hey test,\nYou have unsuccessfully bought in our store!\nReason: ${message}`,
        template: 'error-notification',
        context: {
          name: 'test',
          message,
        },
      });
    });
  });
});
