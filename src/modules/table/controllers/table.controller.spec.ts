import { Test, TestingModule } from '@nestjs/testing';
import { TableController } from './table.controller';
import { TableService } from '@/modules/table/services/table.service';
import { Tables } from '@/modules/table/schemas/table.schema';
import { getModelToken } from '@nestjs/sequelize';

describe('TableController', () => {
  let controller: TableController;

  const mockTableService = {
    create: jest.fn().mockResolvedValue({}),
    read: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    lists: jest.fn().mockResolvedValue([]),
    paginate: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableController],
      providers: [
        TableService,
        {
          provide: getModelToken(Tables),
          useValue: {},
        },
        {
          provide: TableService,
          useValue: mockTableService,
        },
      ],
    }).compile();

    controller = module.get<TableController>(TableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});