import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, {
    nullable: true,
    defaultValue: 1,
  })
  @Min(1)
  page: number = 1;

  @Field(type => Int, {
    nullable: true,
    defaultValue: 10,
  })
  @Min(1)
  @Max(20)
  limit: number = 10;
}
