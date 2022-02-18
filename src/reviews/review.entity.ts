import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Buyer } from '../buyers/buyer.entity';
import { Product } from '../products/product.entity';

@ObjectType({ description: 'Review model' })
@Entity()
export class Review {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => Int, { nullable: true })
  @Column({
    nullable: true,
    default: null
  })
  rating?: number;

  @Field()
  @Column("text")
  comment: string;

  @Field(type => Product)
  @ManyToOne(type => Product, product => product.reviews)
  product: Product;

  @Field(type => Buyer)
  @ManyToOne(type => Buyer)
  buyer: Buyer;
}
