import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { Tables } from '@/modules/table/schemas/table.schema';
import { faker } from '@test/faker';
import { I18nValidationPipe } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import path from 'path';
import { TableController } from '@/modules/table/controllers/table.controller';
import { getModelToken } from '@nestjs/sequelize';
import { TableService } from '@/modules/table/services/table.service';
import { TableRepository } from '@/modules/table/repositories/table.repository';
import { TableInterface } from '@/modules/table/schemas/table.schema';
import { Relation } from '@/modules/relations/schemas/relation.schema';
describe('Tables', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Tables;
  let relationRepository: typeof Relation;
  let app: INestApplication;

  config({
    path: path.resolve(process.cwd(), '.env.testing'),
  });
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
  describe('Tables CRUD', () => {
    describe('create table', () => {
      describe('create table 200', () => {
        it('/ (POST)', async () => {
          const createDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
          };
          const response = await request(app.getHttpServer())
            .post('/')
            .send(createDto)
            .expect(HttpStatus.CREATED);

          expect(response.body).toMatchObject({
            id: expect.any(String),
            name: createDto.name,
            active: createDto.active,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });
      describe('create table fail', () => {
        it('/ (POST)', async () => {
          await request(app.getHttpServer())
            .post('/')
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });

    describe('List tables', () => {
      describe('List tables with elements', () => {
        const createDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const createDto1 = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        it('/ (GET)', async () => {
          await Promise.allSettled([
            repositoryManager.create(<TableInterface>createDto),
            repositoryManager.create(<TableInterface>createDto1),
          ]);
          const response = await request(app.getHttpServer())
            .get('/')
            .expect(HttpStatus.OK);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(2);
        });
      });

      describe('List tables empty', () => {
        it('/ (GET)', async () => {
          const response = await request(app.getHttpServer())
            .get('/')
            .expect(HttpStatus.OK);
          expect(response.body).toEqual([]);
          expect(response.body).toBeInstanceOf(Array);
        });
      });
    });

    describe('List paginate tables', () => {
      it('should return a paginated list with 2 elements', async () => {
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
        const tableListDto = { paginate: { page: 1 } };
        const response = await request(app.getHttpServer())
          .get('/')
          .query(tableListDto)
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

      it('should return an empty paginated list', async () => {
        const tableListDto = { paginate: { page: 1 } };
        const response = await request(app.getHttpServer())
          .get('/')
          .query(tableListDto)
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
    });

    describe('Read table', () => {
      let tableId: string;
      describe('Read table not fail', () => {
        it('/:id (GET)', async () => {
          const createDto = {
            name: faker.company.name(),
            active: faker.datatype.boolean(),
          };
          const table = await repositoryManager.create(
            <TableInterface>createDto,
          );
          tableId = table.id;
          // Verifica que el ID existe
          expect(tableId).toBeDefined();
          const response = await request(app.getHttpServer())
            .get(`/${tableId}`)
            .expect(HttpStatus.OK);
          console.info('response', response.body);
          expect(response.body).toMatchObject({
            id: tableId,
            name: createDto.name,
            active: createDto.active,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });

      describe('Read table fail', () => {
        it('/:id (GET)', async () => {
          tableId = uuidv4();
          // Verifica que el ID existe
          expect(tableId).toBeDefined();
          await request(app.getHttpServer())
            .get(`/${tableId}`)
            .expect(HttpStatus.NOT_FOUND);
        });
      });
    });

    describe('Update table', () => {
      let tableId: string;

      it('/:id (PATCH)', async () => {
        const createDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await repositoryManager.create(<TableInterface>createDto);
        tableId = table.id;
        const updateDto = {
          name: faker.company.name(),
          active: !createDto.active,
        };

        const updateResponse = await request(app.getHttpServer())
          .patch(`/${tableId}`)
          .send(updateDto)
          .expect(HttpStatus.OK);
        expect(updateResponse.body).toEqual([
          null,
          expect.any(Number), // affectedCount
        ]);
      });

      it('/:id (PATCH) fail', async () => {
        tableId = uuidv4();
        const updateDto = {
          name: faker.company.name,
          active: faker.datatype.boolean(),
        };

        const updateResponse = await request(app.getHttpServer())
          .patch(`/${tableId}`)
          .send(updateDto)
          .expect(HttpStatus.OK);
        expect(updateResponse.body).toEqual([
          expect.arrayContaining([]),
          0, // affectedCount
        ]);
      });
    });

    describe('Delete table', () => {
      let tableId: string;
      it('/:id (DELETE)', async () => {
        const createDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await Tables.create(<TableInterface>createDto);
        tableId = table.id;
        const del = await request(app.getHttpServer())
          .delete(`/${tableId}`)
          .expect(HttpStatus.OK);
        expect(del.body).toBe(1);
        await request(app.getHttpServer())
          .get(`/${tableId}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('/:id (SOFT DELETE)', async () => {
        const createDto = {
          name: faker.company.name(),
          active: faker.datatype.boolean(),
        };
        const table = await Tables.create(<TableInterface>createDto);

        tableId = table.id;
        const del = await request(app.getHttpServer())
          .delete(`/${tableId}`)
          .send({ force: false })
          .expect(HttpStatus.OK);
        expect(del.body).toBe(1);
        await request(app.getHttpServer())
          .get(`/${tableId}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
