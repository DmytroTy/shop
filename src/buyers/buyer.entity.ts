import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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

  @Column()
  password: string;

  @Column({
    nullable: true,
    default: null
  })
  refreshToken?: string;

  @Column({
    type: "timestamp",
    nullable: true,
    default: null
  })
  expiresIn?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(type => Order, order => order.buyer)
  orders?: Order[];
}
