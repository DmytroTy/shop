import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  color: string;

  @Column("decimal")
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
