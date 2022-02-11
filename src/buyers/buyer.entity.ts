import { Exclude } from 'class-transformer';
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

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({
    unique: true,
    nullable: true,
  })
  @Exclude()
  facebookId?: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  @Exclude()
  expiresIn?: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @OneToMany(type => Order, order => order.buyer)
  orders?: Order[];
}
