import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { MockCategoriesRepository } from './testing/mock.categories.repository';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        ConfigService,
        LoggerWinston,
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: MockCategoriesRepository,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
});
