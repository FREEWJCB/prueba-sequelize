import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import { TableRepository } from '@/modules/table/repositories/table.repository';
import {Tables, TableInterface} from '@/modules/table/schemas/table.schema';
import { TableListDto } from '@/modules/table/dtos/table.lists.dto';
import { faker } from '@faker-js/faker';
import {Sequelize} from 'sequelize-typescript';
import {Relation} from '@/modules/relations/schemas/relation.schema';
import {getSequelizeInstance, SequelizeTestingModule} from '@test/root.sequelize';
import {TableController} from '@/modules/table/controllers/table.controller';
import {getModelToken} from '@nestjs/sequelize';
import {v4 as uuidv4} from 'uuid';

describe('TableService', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Tables;
  let relationRepository: typeof Relation;
  let service: TableService;

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
      service = module.get<TableService>(TableService);
  });
  afterAll(async () => {
    await sequelize.close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('paginate', () => {
    it('should return empty paged tables', async () => {
      const query: TableListDto = new TableListDto();
      query.paginate = { page: 1 };
      const result = await service.paginate(query);
      expect(result.data.length).toBe(0);
    });
    it('should return paged tables', async () => {
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
      const query: TableListDto = new TableListDto();
      query.paginate = { page: 1 };
      const result = await service.paginate(query);
      expect(result.data.length).toBe(2);
    });
  });

  describe('lists', () => {
    it('should return empty a list of tables', async () => {
      const query: TableListDto = new TableListDto();
      const result = await service.lists(query);
      expect(result.length).toBe(0);
    });

    it('should return empty a list of tables', async () => {
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
      const query: TableListDto = new TableListDto();
      const result = await service.lists(query);
      expect(result.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a table', async () => {
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const result = await service.create(body);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Tables);
      // expect(result).toEqual(expect.objectContaining(body));
    });
  });

  describe('update', () => {
    it('should update a table by id', async () => {
      const table: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const createdTable = await repositoryManager.create(<TableInterface>table);
      const id = createdTable.id;
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const result = await service.update(id, body);
      console.log('resultdddd', result);
      expect(result).toEqual([undefined, 1]);
    });

    it('should not update a table by id', async () => {
      const id = uuidv4();
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const result = await service.update(id, body);
      expect(result).toEqual([undefined, 0]);
    });
  });

  describe('read', () => {
    it('should return a table by id', async () => {
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const createdTable = await repositoryManager.create(<TableInterface>body);
      const id = createdTable.id;
      const result = await service.read(id);
      console.log('resusslt', result);
      
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Tables);
      // expect(result).toEqual(expect.objectContaining(body));
    });
  
    it('should not return a table by id', async () => {
      const id = uuidv4();
      await expect(service.read(id)).rejects.toThrow('Model Not Found Exception');
    });
  });

  describe('delete', () => {
    it('should delete a table by id', async () => {
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const createdTable = await repositoryManager.create(<TableInterface>body);
      const id = createdTable.id;
      const result = await service.delete(id, true);
      expect(result).toBe(1);
    });

    it('should softdelete a table by id', async () => {
      const body: Partial<Tables> = { name: faker.company.name(), active: faker.datatype.boolean() };
      const createdTable = await repositoryManager.create(<TableInterface>body);
      const id = createdTable.id;
      const result = await service.delete(id);
      expect(result).toBe(1);
    });
  });
});
