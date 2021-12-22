import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Entity()
export class OrderProduct {
  @Column()
  quantity: number;

  @ManyToOne(type => Order, order => order.ordersProducts)
  order: Order;

  @ManyToOne(type => Product, product => product.ordersProducts)
  product: Product;

}
