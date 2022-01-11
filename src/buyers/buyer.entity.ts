import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Order } from '../orders/order.entity';

@Entity()
export class Buyer {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  username: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @ApiHideProperty()
  @Column({
    nullable: true,
    default: null
  })
  refreshToken?: string;

  @ApiHideProperty()
  @Column({
    type: "timestamp",
    nullable: true,
    default: null
  })
  expiresIn?: Date;

  @ApiHideProperty()
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(type => Order, order => order.buyer)
  orders?: Order[];
}
