import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInstance, IsInt, IsNotEmpty, Min, Max } from 'class-validator';
import { IdType } from '../../dto/id-input.type';

@InputType()
export class CreateReviewDto {
  @Field(type => Int, { nullable: true })
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  readonly comment: string;

  @Field(type => IdType)
  @ApiProperty()
  @IsInstance(IdType)
  readonly product: IdType;
}
