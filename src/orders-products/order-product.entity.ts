import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Entity()
export class OrderProduct {
  @Column()
  quantity: number;

  @ManyToOne(type => Order, order => order.ordersProducts)
  @JoinColumn()
  @PrimaryColumn({ type: "int" })
  order: Order;

  @ManyToOne(type => Product)
  @JoinColumn()
  @PrimaryColumn({ type: "int" })
  product: Product;

}
