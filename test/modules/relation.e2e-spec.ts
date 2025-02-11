import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { Tables } from '@/modules/table/schemas/table.schema';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { faker } from '@test/faker';
import { I18nValidationPipe } from 'nestjs-i18n';
import { TableInterface } from '@/modules/table/schemas/table.schema';
import { RelationInterface } from '@/modules/relations/schemas/relation.schema';
import { v4 as uuidv4 } from 'uuid';
import {SequelizeTestingModule, getSequelizeInstance} from '@test/root.sequelize';
import {config} from 'dotenv';
import path from 'path';
import {getModelToken} from '@nestjs/sequelize';
import {TableRepository} from '@/modules/table/repositories/table.repository';
import {RelationController} from '@/modules/relations/controllers/relation.controller';
import {RelationService} from '@/modules/relations/services/relation.service';
import {RelationRepository} from '@/modules/relations/repositories/relation.repository';

describe('Relations', () => {
  let sequelize: Sequelize;
    let repositoryTable: typeof Tables;
    let repositoryManager: typeof Relation;
    let app: INestApplication;
    
    config({
      path: path.resolve(process.cwd(), '.env.testing'),
    });
    beforeEach(async () => {
      sequelize = getSequelizeInstance([Tables, Relation]); // Crea la instancia de Sequelize
      await sequelize.sync(); // Sincroniza los modelos con la BD en memoria
      repositoryTable = sequelize.models['Tables'] as typeof Tables;
      repositoryManager = sequelize.models['Relation'] as typeof Relation;
      const module: TestingModule = await Test.createTestingModule({
        controllers: [RelationController],
        providers: [
          {
            provide: getModelToken(Tables),
            useValue: repositoryTable,
          },
          {
            provide: getModelToken(Relation),
            useValue: repositoryManager,
          },
          RelationService,
          RelationRepository,
          TableRepository,
        ],
        imports: [
          ...SequelizeTestingModule([Tables, Relation]),
        ],
      }).compile();
  
      app = module.createNestApplication();
      app.useGlobalPipes(
        new I18nValidationPipe({
          transform: true,
        }),
      );
      await app.init();
    });
  
    afterAll(async () => {
      await sequelize.close();
      await app.close();
    });

  describe('Relations CRUD', () => {
    describe('create relation', () => {
      describe('create relation 200', () => {
        it('/relation (POST)', async () => {
          const tableCreateDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
          };
          const table = await repositoryTable.create(<TableInterface>tableCreateDto);
          const createDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
            table_id: table.id,
          };
          const response = await request(app.getHttpServer())
            .post('/relation')
            .send(createDto)
            .expect(HttpStatus.CREATED);
          expect(response.body).toMatchObject({
            id: expect.any(String),
            name: createDto.name,
            tableId: createDto.table_id, // Asegúrate de que el campo coincida con el nombre en la respuesta
            active: createDto.active,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });

      describe('create relation fail', () => {
        it('/relation (POST)', async () => {
          await request(app.getHttpServer())
            .post('/relation')
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });

    describe('List relations', () => {
      describe('List relations empty', () => {
        it('/relation (GET)', async () => {
          const response = await request(app.getHttpServer())
            .get('/relation')
            .expect(HttpStatus.OK);
          expect(response.body).toEqual([]);
          expect(response.body).toBeInstanceOf(Array);
        });
      });

      describe('List relations with elements', () => {
        it('/relation (GET)', async () => {
          const tableCreateDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
          };
          const table = await repositoryTable.create(<TableInterface>tableCreateDto);

          const createDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
            tableId: table.id,
          };
          const createDto1 = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
            tableId: table.id,
          };
          await Promise.allSettled([
            repositoryManager.create(<RelationInterface>createDto),
            repositoryManager.create(<RelationInterface>createDto1)
          ]);
          const response = await request(app.getHttpServer())
            .get('/relation')
            .expect(HttpStatus.OK);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(2);
        });
      });
    });

    describe('List paginate relations', () => {
      it('should return an empty paginated list', async () => {
        const relationListDto = { paginate: { page: 1 } };
        const response = await request(app.getHttpServer())
          .get('/relation')
          .query(relationListDto)
          .expect(HttpStatus.OK);
        expect(response.body).toEqual({
          data: [],
          meta: {
            total: expect.any(Number),
            page: '1',
            lastPage: expect.any(Number),
            limit: 10,
          },
        });
      });

      it('should return a paginated list with 2 elements', async () => {
        const tableCreateDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await repositoryTable.create(<TableInterface>tableCreateDto);

        const createDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
          tableId: table.id,
        };
        const createDto1 = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
          tableId: table.id,
        };
        await Promise.allSettled([
          repositoryManager.create(<RelationInterface>createDto),
          repositoryManager.create(<RelationInterface>createDto1)
        ]);
        const relationListDto = { paginate: { page: 1 } };
        const response = await request(app.getHttpServer())
          .get('/relation')
          .query(relationListDto)
          .expect(HttpStatus.OK);
        expect(response.body).toEqual({
          data: expect.any(Array),
          meta: {
            total: 2,
            page: '1',
            lastPage: expect.any(Number),
            limit: 10,
          },
        });
        expect(response.body.data).toHaveLength(2);
      });
    });

    describe('Read relation', () => {
      let relationId: string;
      describe('Read relation not fail', () => {
        it('/relation/:id (GET)', async () => {
          const tableCreateDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
          };
          const table = await repositoryTable.create(<TableInterface>tableCreateDto);

          const createDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
            tableId: table.id,
          };
          const relation = await repositoryManager.create(<RelationInterface>createDto);
          relationId = relation.id;
          // Verifica que el ID existe
          expect(relationId).toBeDefined();
          const response = await request(app.getHttpServer())
            .get(`/relation/${relationId}`)
            .expect(HttpStatus.OK);
          expect(response.body).toMatchObject({
            id: relationId,
            name: createDto.name,
            tableId: createDto.tableId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });

      describe('Read relation fail', () => {
        it('/relation/:id (GET)', async () => {
          relationId = uuidv4();
          // Verifica que el ID existe
          expect(relationId).toBeDefined();
          await request(app.getHttpServer())
            .get(`/relation/${relationId}`)
            .expect(HttpStatus.NOT_FOUND);
        });
      });
    });

    describe('Update relation', () => {
      let relationId: string;

      it('/relation/:id (PATCH)', async () => {
        const tableCreateDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await repositoryTable.create(<TableInterface>tableCreateDto);

        const createDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
          tableId: table.id,
        };
        const relation = await repositoryManager.create(<RelationInterface>createDto);
        relationId = relation.id;
        const updateDto = {
          name: faker.company.name(),
          active: !createDto.active,
          table_id: table.id,
        };

        const updateResponse = await request(app.getHttpServer())
          .patch(`/relation/${relationId}`)
          .send(updateDto)
          .expect(HttpStatus.OK);
        expect(updateResponse.body).toEqual([
          null,
          expect.any(Number), // affectedCount
        ]);
      });

      it('/relation/:id (PATCH) fail', async () => {
        relationId = uuidv4();
        const updateDto = { name: faker.company.name(), tableId: uuidv4() };

        const updateResponse = await request(app.getHttpServer())
          .patch(`/relation/${relationId}`)
          .send(updateDto)
          .expect(HttpStatus.OK);

        expect(updateResponse.body).toEqual([
          null,
          0, // affectedCount
        ]);
      });
    });

    describe('Delete relation', () => {
      let relationId: string;

      it('/relation:id (DELETE)', async () => {
        const tableCreateDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await repositoryTable.create(<TableInterface>tableCreateDto);

        const createDto = {
          name: faker.company.name(),
          tableId: table.id,
        };
        const relation = await repositoryManager.create(<RelationInterface>createDto);
        relationId = relation.id;
        const del = await request(app.getHttpServer())
          .delete(`/relation/${relationId}`)
          .expect(HttpStatus.OK);
        expect(del.body).toBe(1);

        await request(app.getHttpServer())
          .get(`/relation/${relationId}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('/relation/:id (SOFT DELETE)', async () => {
        const tableCreateDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await repositoryTable.create(<TableInterface>tableCreateDto);

        const createDto = {
          name: faker.company.name(),
          tableId: table.id,
        };
        const relation = await repositoryManager.create(<RelationInterface>createDto);
        relationId = relation.id;
        const del = await request(app.getHttpServer())
          .delete(`/relation/${relationId}`)
          .send({ force: false })
          .expect(HttpStatus.OK);
        expect(del.body).toBe(1);
        // Verifica que el registro no está disponible
        await request(app.getHttpServer())
          .get(`/relation/${relationId}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
