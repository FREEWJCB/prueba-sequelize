import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { RelationRepository } from './relation.repository';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { Tables } from '@/modules/table/schemas/table.schema';
import { ModelNotFoundException } from '@/modules/_global/exceptions/model.not.found.exception';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';
import { faker } from '@faker-js/faker';
import { SequelizeTestingModule } from '@test/root.sequelize';

describe('RelationRepository', () => {
  let repository: RelationRepository;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...SequelizeTestingModule([Relation, Tables]),
      ],
      providers: [RelationRepository],
    }).compile();

    repository = module.get<RelationRepository>(RelationRepository);
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('paginate', () => {
    it('should return paginated relations', async () => {
      const query = { limit: 10, offset: 0 };
      const result = await repository.paginate(query, 1);
      expect(result).toBeInstanceOf(PaginatedResponse);
    });
  });

  describe('lists', () => {
    it('should return a list of relations', async () => {
      const query = {};
      const result = await repository.lists(query);
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a relation', async () => {
      const table = await sequelize.models['Tables']!.create({ name: faker.company.name(), active: faker.datatype.boolean() }) as Tables;
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const result = await repository.create(body);
      expect(result).toMatchObject(body);
    });
  });

  describe('find', () => {
    it('should find a relation', async () => {
        const table = await sequelize.models['Tables']!.create({ name: faker.company.name(), active: faker.datatype.boolean() }) as Tables;
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const createdRelation = await repository.create(body);
      const result = await repository.find({ where: { id: createdRelation.id } });
      expect(result).toMatchObject(body);
    });
  });

  describe('findOrFail', () => {
    it('should find a relation or fail', async () => {
        const table = await sequelize.models['Tables']!.create({ name: faker.company.name(), active: faker.datatype.boolean() }) as Tables;
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const createdRelation = await repository.create(body);
      const result = await repository.findOrFail({ where: { id: createdRelation.id } });
      expect(result).toMatchObject(body);
    });

    it('should throw ModelNotFoundException if relation not found', async () => {
      await expect(repository.findOrFail({ where: { id: 'non-existent-id' } })).rejects.toThrow(ModelNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a relation by id', async () => {
        const table = await sequelize.models['Tables']!.create({ name: faker.company.name(), active: faker.datatype.boolean() }) as Tables;
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id, active: faker.datatype.boolean() };
      const createdRelation = await repository.create(body);
      const updateBody: Partial<Relation> = { name: 'Updated Relation', tableId: table.id };
      const [affectedCount, affectedRows] = await repository.update({ id: createdRelation.id }, updateBody);
      expect(affectedCount).toBe(1);
      expect(affectedRows[0]).toMatchObject({
        id: createdRelation.id,
        name: updateBody.name,
        tableId: table.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });
    });
  });

  describe('delete', () => {
    it('should delete a relation by id', async () => {
      const table = await sequelize.models['Tables']!.create({ name: faker.company.name(), active: faker.datatype.boolean() }) as Tables;
      const body: Partial<Relation> = { name: faker.company.name(), tableId: table.id };
      const createdRelation = await repository.create(body);
      const result = await repository.delete({ where: { id: createdRelation.id } });
      expect(result).toBe(1);
    });
  });
});
