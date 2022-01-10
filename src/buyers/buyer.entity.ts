import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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
  refreshToken: string;

  @Column({
    type: "timestamp",
    nullable: true,
    default: null
  })
  expiresIn: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(type => Order, order => order.buyer)
  orders: Order[];
}
