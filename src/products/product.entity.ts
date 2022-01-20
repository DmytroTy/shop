import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, Check } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Check(`"quantity" > 0`)
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
