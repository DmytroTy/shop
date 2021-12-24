import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    return this.buyersRepository.create(createBuyerDto);
  }

  async findAll(): Promise<Buyer[]> {
    return this.buyersRepository.find();
  }

  async findOne(id: number): Promise<Buyer> {
    return this.buyersRepository.findOne(id);
  }

  async update(id: number, updateBuyerDto: UpdateBuyerDto): Promise<UpdateResult> {
    return this.buyersRepository.update(id, updateBuyerDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.buyersRepository.delete(id);
  }
}
