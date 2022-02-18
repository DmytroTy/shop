import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@ObjectType({ description: 'Buyer model' })
@Entity()
export class Buyer {
  @Field(type => Int)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @ApiPropertyOptional()
  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Field()
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

  @Field(type => [Order], { nullable: true })
  @OneToMany(type => Order, order => order.buyer)
  orders?: Order[];
}
