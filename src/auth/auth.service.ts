import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BuyersService } from '../buyers/buyers.service';

@Injectable()
export class AuthService {
  constructor(
    private buyersService: BuyersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.buyersService.findOne(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
