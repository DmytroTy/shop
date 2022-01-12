import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty()
  @Column("decimal")
  price: number;

  @ApiProperty()
  @Column({ default: 0 })
  quantity: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
