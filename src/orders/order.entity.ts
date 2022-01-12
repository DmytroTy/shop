import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Buyer } from '../buyers/buyer.entity';
import { OrderProduct } from '../orders-products/order-product.entity';
import { Status } from '../enums/status.enum';

@Entity()
export class Order {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: Status, enumName: 'Status' })
  @Column({
    type: "enum",
    enum: Status,
    default: Status.OPENLY
  })
  status: Status;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(type => Buyer, buyer => buyer.orders)
  buyer: Buyer;

  @ApiProperty({ type: () => [OrderProduct] })
  @OneToMany(type => OrderProduct, orderProduct => orderProduct.order)
  ordersProducts: OrderProduct[];
}
