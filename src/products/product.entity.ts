import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Check, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaginatedReview, Review } from '../reviews/review.entity';
import { Paginated } from '../types/paginated.type';

@ObjectType({ description: 'Product model' })
@Entity()
@Check(`"quantity" >= 0`)
export class Product {
  @Field(type => Int)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @ApiProperty()
  @Column()
  type: string;

  @Field()
  @ApiProperty()
  @Column()
  color: string;

  @Field(type => Float)
  @ApiProperty()
  @Column("decimal")
  price: number;

  @Field(type => Int)
  @ApiProperty()
  @Column({ default: 0 })
  quantity: number;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @Field(type => PaginatedReview, { nullable: true })
  // @ApiProperty({ type: PaginatedReview })
  @OneToMany(type => Review, review => review.product)
  reviews?: Review[];
}

@ObjectType()
export class PaginatedProduct extends Paginated(Product) {}
