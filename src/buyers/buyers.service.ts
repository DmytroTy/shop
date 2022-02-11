import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Buyer } from './buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Injectable()
export class BuyersService {
  constructor(
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
  ) {}

  async create(createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.buyersRepository.save(createBuyerDto);
  }

  async findOne(email: string): Promise<Buyer> {
    return this.buyersRepository.findOne({ email });
  }

  async findOneByFacebookId(facebookId: string): Promise<Buyer> {
    return this.buyersRepository.findOne({ facebookId });
  }

  async update(id: number, updateBuyerDto: UpdateBuyerDto, userId: number): Promise<UpdateResult> {
    return this.buyersRepository.update(userId, updateBuyerDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.buyersRepository.softDelete(id);
  }
}
