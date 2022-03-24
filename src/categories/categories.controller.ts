import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all categories.',
    type: [Category],
  })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get category by id.',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'No record with this ID found!' })
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }
}
