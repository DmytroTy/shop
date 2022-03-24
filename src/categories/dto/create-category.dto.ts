import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Product } from '../../products/product.entity';

@InputType()
export class CreateCategoryDto {
  @Field()
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @Field(type => Int, { nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number;

  @Field(type => [Product], { nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  readonly products?: Product[];
}
