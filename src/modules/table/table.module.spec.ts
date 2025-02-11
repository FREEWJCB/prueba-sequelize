import { Test, TestingModule } from '@nestjs/testing';
import { TableModule } from './table.module';
import { TableController } from '@/modules/table/controllers/table.controller';
import { TableService } from '@/modules/table/services/table.service';
import { TableRepository } from '@/modules/table/repositories/table.repository';
import { Tables } from './schemas/table.schema';
import { Relation } from '../relations/schemas/relation.schema';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';

describe('TableModule', () => {
  let module: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...SequelizeTestingModule([Tables, Relation]), TableModule],
    }).compile();
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have TableController', () => {
    const controller = module.get<TableController>(TableController);
    expect(controller).toBeDefined();
  });

  it('should have TableService', () => {
    const service = module.get<TableService>(TableService);
    expect(service).toBeDefined();
  });

  it('should have TableRepository', () => {
    const repository = module.get<TableRepository>(TableRepository);
    expect(repository).toBeDefined();
  });
});