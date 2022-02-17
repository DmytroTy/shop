import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Buyer } from '../buyers/buyer.entity';
import { BuyersService } from '../buyers/buyers.service';
import { CreateBuyerDto } from '../buyers/dto/create-buyer.dto';
import { LoggerWinston } from '../logger/logger-winston.service';

const POSTGRES_ERROR_CODE_DUPLICATE_KEY_VALUE = '23505';

@Injectable()
export class AuthService {
  constructor(
    private buyersService: BuyersService,
    private readonly logger: LoggerWinston,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.buyersService.findOne(email);
    const isMatch = user ? await bcrypt.compare(pass, user.password) : false;

    if (isMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async facebookLogin(user: any) {
    let buyer = await this.buyersService.findOne(user.email);
    if (buyer && !buyer.facebookId) {
      await this.buyersService.update(buyer.id, { facebookId: user.facebookId }, buyer.id);
    }

    if (!buyer) {
      buyer = await this.buyersService.findOneByFacebookId(user.facebookId);
    }

    if (!buyer) {
      buyer = await this.buyersService.create({
        email: user.email,
        username: user.firstName,
        facebookId: user.facebookId,
      });
    }

    const payload = { email: buyer.email, sub: buyer.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createBuyerDto: CreateBuyerDto) {
    const saltOrRounds = 10;
    const pass = createBuyerDto.password;
    createBuyerDto.password = await bcrypt.hash(pass, saltOrRounds);

    let buyer: Buyer;
    try {
      buyer = await this.buyersService.create(createBuyerDto);
      delete buyer.password;
      delete buyer.deletedAt;
    } catch (err) {
      if (err.code === POSTGRES_ERROR_CODE_DUPLICATE_KEY_VALUE) {
        this.logger.warn(`User error: ${err.message}`, 'AuthService');
        throw new ConflictException('A user with this email already exists!');
      }
      this.logger.error(`Important error: ${err.message}`, 'AuthService', err);
      throw new InternalServerErrorException('Failed to create user account, please try again later.');
    }

    return buyer;
  }
}
