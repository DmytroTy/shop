import { Entity, Column, PrimaryGeneratedColumn, Timestamp, OneToMany } from 'typeorm';
import { OrderProduct } from '../orders-products/order-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  color: string;

  @Column("decimal")
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({
    type: "timestamp",
    nullable: true,
    default: null
  })
  deletedAt: Timestamp;

  @OneToMany(type => OrderProduct, orderProduct => orderProduct.product)
  ordersProducts: OrderProduct[];
}
