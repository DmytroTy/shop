import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, Check, OneToMany } from 'typeorm';
import { Review } from '../reviews/review.entity';

@ObjectType({ description: 'Product model' })
@Entity()
@Check(`"quantity" >= 0`)
export class Product {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  color: string;

  @Field(type => Float)
  @Column("decimal")
  price: number;

  @Field(type => Int)
  @Column({ default: 0 })
  quantity: number;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @Field(type => [Review], { nullable: true })
  @OneToMany(type => Review, review => review.product)
  reviews?: Review[];
}
