import { Injectable, Inject } from '@nestjs/common';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { ModelNotFoundException } from '@/modules/_global/exceptions/model.not.found.exception';
import { FindOptions, WhereOptions, DestroyOptions } from 'sequelize';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { Tables } from '@/modules/table/schemas/table.schema';

@Injectable()
export class RelationRepository {
  constructor(
    @InjectModel(Relation) private readonly relation: typeof Relation,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  public async paginate(
    query: FindOptions<Relation>,
    page: number = 1,
  ): Promise<PaginatedResponse<Relation>> {
    const { rows, count } = await this.relation.findAndCountAll(query);
    const lastPage = Math.ceil(count / (query.limit ?? 10));

    return {
      data: rows,
      meta: {
        total: count,
        page,
        lastPage,
        limit: query.limit ?? 10,
      },
    };
  }

  public async lists(query: FindOptions<Relation>): Promise<Relation[]> {
    return this.relation.findAll(query);
  }

  public async create(relation: Partial<Relation>): Promise<Relation> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.relation.create(relation as Relation, {
        transaction,
      });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async find(query: FindOptions<Relation>): Promise<Relation | null> {
    return this.relation.findOne({ ...query, include: [{ model: Tables }] });
  }

  public async findOrFail(query: FindOptions<Relation>): Promise<Relation> {
    const result = await this.find(query);
    if (!result) {
      throw new ModelNotFoundException('Relation', JSON.stringify(query.where));
    }
    return result;
  }

  public async update(
    query: WhereOptions<Relation>,
    body: Partial<Relation>,
  ): Promise<[affectedCount: number, affectedRows: Relation[]]> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.relation.update(body, {
        where: query,
        returning: true,
        transaction,
      });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(criteria: DestroyOptions<Relation>): Promise<number> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.relation.destroy({ ...criteria, transaction });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
