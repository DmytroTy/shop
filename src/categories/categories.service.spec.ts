import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerWinston } from '../logger/logger-winston.service';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { MockCategoriesRepository } from './testing/mock.categories.repository';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
});
