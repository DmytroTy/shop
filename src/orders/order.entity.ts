import { Entity, Column, PrimaryGeneratedColumn, Timestamp, OneToMany, ManyToOne } from 'typeorm';
import { Buyer } from '../buyers/buyer.entity';
import { OrderProduct } from '../orders-products/order-product.entity';
import { Status } from '../enums/status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.OPENLY
  })
  status: Status;

  @Column({
    type: "timestamp",
    nullable: true,
    default: null
  })
  deletedAt: Timestamp;

  @ManyToOne(type => Buyer, buyer => buyer.orders)
  buyer: Buyer;

  @OneToMany(type => OrderProduct, orderProduct => orderProduct.order)
  ordersProducts: OrderProduct[];
}
