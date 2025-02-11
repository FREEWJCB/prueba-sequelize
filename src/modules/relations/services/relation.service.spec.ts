import { Test, TestingModule } from '@nestjs/testing';
import { RelationService } from './relation.service';
import { RelationRepository } from '@/modules/relations/repositories/relation.repository';
import { TableRepository } from '@/modules/table/repositories/table.repository';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { RelationListDto } from '@/modules/relations/dtos/relation.lists.dto';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';
import { faker } from '@faker-js/faker';

describe('RelationService', () => {
  let service: RelationService;
  let relationRepository: RelationRepository;
  let tableRepository: TableRepository;

  const mockRelationRepository = {
    paginate: jest.fn().mockResolvedValue(new PaginatedResponse<Relation>()),
    lists: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue([1, [{}]]),
    findOrFail: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(1),
  };

  const mockTableRepository = {
    findOrFail: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationService,
        {
          provide: RelationRepository,
          useValue: mockRelationRepository,
        },
        {
          provide: TableRepository,
          useValue: mockTableRepository,
        },
      ],
    }).compile();

    service = module.get<RelationService>(RelationService);
    relationRepository = module.get<RelationRepository>(RelationRepository);
    tableRepository = module.get<TableRepository>(TableRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('paginate', () => {
    it('should return paginated relations', async () => {
      const query: RelationListDto = new RelationListDto();
      query.paginate = { page: 1 };
      const result = await service.paginate(query);
      expect(relationRepository.paginate).toHaveBeenCalledWith(
        query.toQueryOptions(),
        query.paginate.page,
      );
      expect(result).toBeInstanceOf(PaginatedResponse);
    });
  });

  describe('lists', () => {
    it('should return a list of relations', async () => {
      const query: RelationListDto = new RelationListDto();
      const result = await service.lists(query);
      expect(relationRepository.lists).toHaveBeenCalledWith(query.toQueryOptions());
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a relation', async () => {
      const table = await tableRepository.create({ name: faker.company.name(), active: faker.datatype.boolean() });
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const result = await service.create(body);
      expect(tableRepository.findOrFail).toHaveBeenCalledWith({ where: { id: body.tableId } });
      expect(relationRepository.create).toHaveBeenCalledWith(body);
      expect(result).toEqual({});
    });
  });

  describe('update', () => {
    it('should update a relation by id', async () => {
      const table = await tableRepository.create({ name: faker.company.name(), active: faker.datatype.boolean() });
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const createdRelation = await service.create(body);
      const id = createdRelation.id;
      const updateBody: Partial<Relation> = { name: 'Updated Relation', tableId: table.id };
      const result = await service.update(id, updateBody);
      expect(relationRepository.update).toHaveBeenCalledWith({ id }, updateBody);
      expect(result).toEqual([1, [{}]]);
    });
  });

  describe('read', () => {
    it('should return a relation by id', async () => {
      const table = await tableRepository.create({ name: faker.company.name(), active: faker.datatype.boolean() });
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const createdRelation = await service.create(body);
      const id = createdRelation.id;
      const result = await service.read(id);
      expect(relationRepository.findOrFail).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual({});
    });
  });

  describe('delete', () => {
    it('should delete a relation by id', async () => {
      const table = await tableRepository.create({ name: faker.company.name(), active: faker.datatype.boolean() });
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const createdRelation = await service.create(body);
      const id = createdRelation.id;
      const result = await service.delete(id, true);
      expect(result).toBe(1);
    });
  });
});
