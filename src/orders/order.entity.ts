import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Buyer } from '../buyers/buyer.entity';
import { Product } from '../products/product.entity';
import { Status } from '../enums/status.enum';

@ObjectType({ description: 'Order model' })
@Entity()
export class Order {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => Status)
  @Column({
    type: "enum",
    enum: Status,
    default: Status.OPENLY
  })
  status: Status;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @ManyToOne(type => Buyer, buyer => buyer.orders)
  buyer: Buyer;

  @Field(type => [Product])
  @Column("simple-json")
  orderProducts: Product[];
}
