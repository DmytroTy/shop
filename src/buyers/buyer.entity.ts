import { Entity, Column, PrimaryGeneratedColumn, Timestamp, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class Buyer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    default: null
  })
  refresh_token: string;

  @Column({
    nullable: true,
    default: null
  })
  expires_in: Timestamp;

  @OneToMany(type => Order, order => order.buyer)
  orders: Order[];
}
