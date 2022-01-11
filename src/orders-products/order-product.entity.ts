import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Entity()
export class OrderProduct {
  @ApiProperty()
  @Column()
  quantity: number;

  @ApiHideProperty()
  @ManyToOne(type => Order, order => order.ordersProducts)
  @JoinColumn()
  @PrimaryColumn({ type: "int" })
  order: Order;

  @ApiProperty({ type: () => Product })
  @ManyToOne(type => Product)
  @JoinColumn()
  @PrimaryColumn({ type: "int" })
  product: Product;

}
