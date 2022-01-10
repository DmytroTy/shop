import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BuyersService } from '../buyers/buyers.service';
import { CreateBuyerDto } from '../buyers/dto/create-buyer.dto';

@Injectable()
export class AuthService {
  constructor(
    private buyersService: BuyersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.buyersService.findOne(email);
    const isMatch = user ? await bcrypt.compare(pass, user.password) : false;

    if (isMatch) {
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

  async register(createBuyerDto: CreateBuyerDto) {
    const saltOrRounds = 10;
    const pass = createBuyerDto.password;
    createBuyerDto.password = await bcrypt.hash(pass, saltOrRounds);

    const buyer = await this.buyersService.create(createBuyerDto);
    const { password, deletedAt, ...result } = buyer;

    return result;
  }
}
