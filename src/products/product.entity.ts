import { Exclude } from 'class-transformer';
import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, Check, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../reviews/review.entity';

@Entity()
@Check(`"quantity" >= 0`)
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
  @Exclude()
  deletedAt?: Date;

  @OneToMany(type => Review, review => review.product)
  reviews?: Review[];
}
