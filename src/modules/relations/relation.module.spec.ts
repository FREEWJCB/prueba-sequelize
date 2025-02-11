import { Test, TestingModule } from '@nestjs/testing';
import { RelationModule } from './relation.module';
import { RelationController } from '@/modules/relations/controllers/relation.controller';
import { RelationService } from '@/modules/relations/services/relation.service';
import { RelationRepository } from '@/modules/relations/repositories/relation.repository';
import { Relation } from './schemas/relation.schema';
import { Tables } from '../table/schemas/table.schema';
import { TableRepository } from '../table/repositories/table.repository';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';

describe('RelationModule', () => {
  let module: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...SequelizeTestingModule([Relation, Tables]), RelationModule],
    }).compile();
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have RelationController', () => {
    const controller = module.get<RelationController>(RelationController);
    expect(controller).toBeDefined();
  });

  it('should have RelationService', () => {
    const service = module.get<RelationService>(RelationService);
    expect(service).toBeDefined();
  });

  it('should have RelationRepository', () => {
    const repository = module.get<RelationRepository>(RelationRepository);
    expect(repository).toBeDefined();
  });

  it('should have TableRepository', () => {
    const repository = module.get<TableRepository>(TableRepository);
    expect(repository).toBeDefined();
  });
});