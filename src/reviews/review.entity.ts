import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Buyer } from '../buyers/buyer.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Review {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    nullable: true,
    default: null
  })
  rating?: number;

  @ApiProperty()
  @Column("text")
  comment: string;

  @ManyToOne(type => Product, product => product.reviews)
  product: Product;

  @ManyToOne(type => Buyer)
  buyer: Buyer;
}
