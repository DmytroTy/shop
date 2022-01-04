import { Injectable } from '@nestjs/common';
import { BuyersService } from '../buyers/buyers.service';

@Injectable()
export class AuthService {
  constructor(private buyersService: BuyersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.buyersService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
