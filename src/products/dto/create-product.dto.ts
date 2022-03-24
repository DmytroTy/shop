import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Category } from '../../categories/category.entity';

@InputType()
export class CreateProductDto {
  @Field()
  @ApiProperty()
  @IsNotEmpty()
  readonly type: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  readonly color: string;

  @Field(type => Float)
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @Field(type => Int)
  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly quantity: number;

  @Field(type => [Category])
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly categories: Category[];
}
