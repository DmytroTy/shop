import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@ObjectType({ description: 'Category model' })
@Entity()
export class Category {
  @Field(type => Int)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @ApiProperty()
  @Column()
  name: string;

  @Field(type => Category, { nullable: true })
  @ApiProperty({ type: Category })
  @ManyToOne(type => Category)
  @JoinColumn()
  parent?: Category;

  @Field(type => [Category], { nullable: 'items' })
  @ApiProperty({ type: [Category] })
  @OneToMany(type => Category, category => category.parent)
  child?: Category[];

  // @Field(type => [Product])
  // @ApiProperty({ type: [Product] })
  @ManyToMany(type => Product, product => product.categories)
  @JoinTable({ name: 'categories_products' })
  products?: Product[];
}
