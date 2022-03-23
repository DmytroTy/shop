import { Type } from '@nestjs/common';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType({ description: 'Pagination metainformation' })
class MetaType {
  @Field((type) => Int)
  @ApiProperty()
  totalItems: number;

  @Field((type) => Int)
  @ApiProperty()
  itemCount: number;

  @Field((type) => Int)
  @ApiProperty()
  itemsPerPage: number;

  @Field((type) => Int)
  @ApiProperty()
  totalPages: number;

  @Field((type) => Int)
  @ApiProperty()
  currentPage: number;
}

export interface IPaginatedType<T> {
  items: T[];
  meta: MetaType;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field((type) => [classRef], { nullable: 'items' })
    @ApiProperty({ type: [classRef] })
    items: T[];

    @Field((type) => MetaType)
    @ApiProperty()
    meta: MetaType;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
