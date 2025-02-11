import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { TableRepository } from './table.repository';
import {Tables, TableInterface} from '@/modules/table/schemas/table.schema';
// import { ModelNotFoundException } from '@/modules/_global/exceptions/model.not.found.exception';
// import { faker } from '@faker-js/faker';
import {SequelizeTestingModule, getSequelizeInstance} from '@test/root.sequelize';
import {TableService} from '../services/table.service';
import {Relation} from '@/modules/relations/schemas/relation.schema';
import {TableController} from '@/modules/table/controllers/table.controller';
import {getModelToken} from '@nestjs/sequelize';
import {faker} from '@test/faker';

describe('TableRepository', () => {
  let sequelize: Sequelize;
    let repositoryManager: typeof Tables;
    let relationRepository: typeof Relation;
    let repository: TableRepository;
  
    beforeEach(async () => {
        sequelize = getSequelizeInstance([Tables, Relation]); // Crea la instancia de Sequelize
        await sequelize.sync(); // Sincroniza los modelos con la BD en memoria
        repositoryManager = sequelize.models['Tables'] as typeof Tables;
        relationRepository = sequelize.models['Relation'] as typeof Relation;
        const module: TestingModule = await Test.createTestingModule({
          controllers: [TableController],
          providers: [
            {
              provide: getModelToken(Tables),
              useValue: repositoryManager,
            },
            {
              provide: getModelToken(Relation),
              useValue: relationRepository,
            },
            TableService,
            TableRepository,
          ],
          imports: [...SequelizeTestingModule([Tables, Relation])],
        }).compile();
        // noinspection TypeScriptValidateTypes
        repository = module.get<TableRepository>(TableRepository);
    });
    afterAll(async () => {
      await sequelize.close();
    });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('paginate', () => {
    it('should return paginated tables', async () => {
      const createDto = {
        name: faker.company.name(),
        active: faker.datatype.boolean(),
      };
      const createDto1 = {
        name: faker.company.name(),
        active: faker.datatype.boolean(),
      };
      await Promise.allSettled([
        repositoryManager.create(<TableInterface>createDto),
        repositoryManager.create(<TableInterface>createDto1),
      ]);
      const query = { limit: 10, offset: 0 };
      const result = await repository.paginate(query, 1);
      console.log('resultds', result);
      expect(result.data).toHaveLength(2);
      // expect(result).toEqual({
      //   data: expect.any(Array),
      //   meta: {
      //     total: 2,
      //     page: 1,
      //     lastPage: expect.any(Number),
      //     limit: 10,
      //   },
      // });
    });

    it('should return paginated tables empty', async () => {
      const query = { limit: 10, offset: 0 };
      const result = await repository.paginate(query, 1);
      expect(result).toEqual({
        data: [],
        meta: {
          total: expect.any(Number),
          page: 1,
          lastPage: expect.any(Number),
          limit: 10,
        },
      });
    });
  });

  describe('lists', () => {
    it('should return a list of tables', async () => {
      const query = {};
      const result = await repository.lists(query);
      expect(result).toEqual([]);
    });

    it('should return a list of tables', async () => {
      const createDto = {
        name: faker.company.name(),
        active: faker.datatype.boolean(),
      };
      const createDto1 = {
        name: faker.company.name(),
        active: faker.datatype.boolean(),
      };
      await Promise.allSettled([
        repositoryManager.create(<TableInterface>createDto),
        repositoryManager.create(<TableInterface>createDto1),
      ]);
      const query = {};
      const result = await repository.lists(query);
      expect(result.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a table', async () => {
      const body = { name: faker.company.name(), active: faker.datatype.boolean() };
      const result = await repository.create(body);
      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toMatchObject({
        id: expect.any(String),
        name: body.name,
        active: body.active,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('find', () => {
    it('should find a table', async () => {
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const createdTable = await repositoryManager.create(<TableInterface>body);
      const result = await repository.findOrFail({ where: { id: createdTable.id } });

      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toMatchObject({
        id: expect.any(String),
        name: body.name,
        active: body.active,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  // describe('update', () => {
  //   it('should update a table by id', async () => {
  //     const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
  //     const createdTable = await repository.create(body);
  //     const updateBody: Partial<Tables> = { name: 'Updated Table', active: false };
  //     const [affectedCount, affectedRows] = await repository.update({ id: createdTable.id }, updateBody);
  //     expect(affectedCount).toBe(1);
  //     expect(affectedRows[0]).toMatchObject(updateBody);
  //   });
  // });

  // describe('delete', () => {
  //   it('should delete a table by id', async () => {
  //     const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
  //     const createdTable = await repository.create(body);
  //     const result = await repository.delete({ where: { id: createdTable.id } });
  //     expect(result).toBe(1);
  //   });
  // });
});
