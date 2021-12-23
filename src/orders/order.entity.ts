import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Buyer } from '../buyers/buyer.entity';
import { OrderProduct } from '../orders-products/order-product.entity';

export enum StatusType {
  OPENLY = "openly",
  PROCESSED = "processed",
  CANCELED = "canceled"
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: StatusType,
    default: StatusType.OPENLY
  })
  status: StatusType;

  @ManyToOne(type => Buyer, buyer => buyer.orders)
  buyer: Buyer;

  @OneToMany(type => OrderProduct, orderProduct => orderProduct.order)
  ordersProducts: OrderProduct[];
}
