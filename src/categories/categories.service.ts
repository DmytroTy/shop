import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly logger: LoggerWinston,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  private async findChildRecursive(categories: Category[]): Promise<Category[]> {
    const result = [];

    for(let category of categories) {
      category = await this.findOne(category.id);

      if (category.child.length > 0) {
        category.child = await this.findChildRecursive(category.child);
      }
      result.push(category)
    }

    return result;
  }

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const parent = { id: createCategoryDto.parentId };
    delete createCategoryDto.parentId;

    return this.categoriesRepository.save({ parent, ...createCategoryDto });
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({ where: { parent: IsNull() } });
    return this.findChildRecursive(categories);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne(id, { relations: ['parent', 'child'] });

    if (!category) {
      this.logger.warn(`User error: Category with id = ${id} not found.`, 'CategoriesService');
      throw new NotFoundException();
    }

    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult> {
    let parent;
    if (updateCategoryDto.parentId) {
      parent = { id: updateCategoryDto.parentId };
      delete updateCategoryDto.parentId;
    }

    return this.categoriesRepository.update(id, { parent, ...updateCategoryDto });
  }
}
