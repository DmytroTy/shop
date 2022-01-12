import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Buyer } from '../buyers/buyer.entity';
import { Product } from '../products/product.entity';
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

  @ApiProperty({ type: [Product] })
  @Column("simple-json")
  orderProducts: Product[]; // [{ id: number, type: string, color: string, price: number, quantity: number }];
}
