import { Test, TestingModule } from '@nestjs/testing';
import { RelationController } from './relation.controller';
import { RelationService } from '@/modules/relations/services/relation.service';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { getModelToken } from '@nestjs/sequelize';

describe('RelationController', () => {
  let controller: RelationController;

  const mockRelationService = {
    create: jest.fn().mockResolvedValue({}),
    read: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    lists: jest.fn().mockResolvedValue([]),
    paginate: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationController],
      providers: [
        RelationService,
        {
          provide: getModelToken(Relation),
          useValue: {},
        },
        {
          provide: RelationService,
          useValue: mockRelationService,
        },
      ],
    }).compile();

    controller = module.get<RelationController>(RelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});