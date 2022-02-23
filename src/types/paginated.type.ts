import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType({ description: 'Pagination metainformation' })
class MetaType {
  @Field((type) => Int)
  totalItems: number;

  @Field((type) => Int)
  itemCount: number;

  @Field((type) => Int)
  itemsPerPage: number;

  @Field((type) => Int)
  totalPages: number;

  @Field((type) => Int)
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
    items: T[];

    @Field((type) => MetaType)
    meta: MetaType;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
