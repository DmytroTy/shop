import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(returns => [Category])
  categories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Query(returns => Category)
  category(@Args('id', { type: () => Int }) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }
}
