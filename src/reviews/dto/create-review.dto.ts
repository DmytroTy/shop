import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class CreateReviewDto {
  @Field(type => Int, { nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating?: number;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  readonly comment: string;

  @Field(type => Int)
  @ApiProperty()
  @IsInt()
  @Min(1)
  productId: number;
}
