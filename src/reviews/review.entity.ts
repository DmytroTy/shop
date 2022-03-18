import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Buyer } from '../buyers/buyer.entity';
import { Product } from '../products/product.entity';
import { Paginated } from '../types/paginated.type';

@ObjectType({ description: 'Review model' })
@Entity()
export class Review {
  @Field(type => Int)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => Int, { nullable: true })
  @ApiProperty()
  @Column({
    nullable: true,
    default: null
  })
  rating?: number;

  @Field()
  @ApiProperty()
  @Column("text")
  comment: string;

  // @Field(type => Product)
  @ManyToOne(type => Product, product => product.reviews)
  product: Product;

  // @Field(type => Buyer)
  @ManyToOne(type => Buyer)
  buyer: Buyer;
}

@ObjectType()
export class PaginatedReview extends Paginated(Review) {}
