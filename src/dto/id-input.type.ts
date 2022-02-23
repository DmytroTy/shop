import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class IdType {
  @Field(type => Int)
  @IsInt()
  @Min(1)
  id: number;
}
