import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Buyer } from "../buyers/buyer.entity";
import { Order } from "../orders/order.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    default: null
  })
  customerId?: string;

  @Column({ unique: true })
  transactionId: string;

  @ManyToOne(type => Buyer)
  buyer: Buyer;

  @OneToOne(type => Order)
  @JoinColumn()
  order: Order;
}
