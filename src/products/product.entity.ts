import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderProduct } from '../orders-products/order-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  color: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @OneToMany(type => OrderProduct, orderProduct => orderProduct.product)
  ordersProducts: OrderProduct[];
}
