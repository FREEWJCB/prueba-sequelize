import { Injectable, Inject } from '@nestjs/common';
import { Tables } from '@/modules/table/schemas/table.schema';
import { ModelNotFoundException } from '@/modules/_global/exceptions/model.not.found.exception';
import { FindOptions, WhereOptions, DestroyOptions } from 'sequelize';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
// import {Relation} from '../../relations/schemas/relation.schema';

@Injectable()
export class TableRepository {
  constructor(
    @InjectModel(Tables) private readonly table: typeof Tables,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  public async paginate(
    query: FindOptions<Tables>,
    page: number = 1,
  ): Promise<PaginatedResponse<Tables>> {
    const { rows, count } = await this.table.findAndCountAll(query);
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

  public async lists(query: FindOptions<Tables>): Promise<Tables[]> {
    return this.table.findAll(query);
  }

  public async create(table: Partial<Tables>): Promise<Tables> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.table.create(table as Tables, { transaction });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async find(query: FindOptions<Tables>): Promise<Tables | null> {
    // return this.table.findOne({ ...query, include: [{ 
    //   model: Relation, 
    //   where: { active: true },
    //   required: false,
    //  }] });
    return this.table.findOne({ ...query });
  }

  public async findOrFail(query: FindOptions<Tables>): Promise<Tables> {
    const result = await this.find(query);
    if (!result) {
      throw new ModelNotFoundException('Table', JSON.stringify(query.where));
    }
    return result;
  }

  public async update(
    query: WhereOptions<Tables>,
    body: Partial<Tables>,
  ): Promise<[affectedCount: number, affectedRows: Tables[]]> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.table.update(body, {
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

  public async delete(criteria: DestroyOptions<Tables>): Promise<number> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.table.destroy({ ...criteria, transaction });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
