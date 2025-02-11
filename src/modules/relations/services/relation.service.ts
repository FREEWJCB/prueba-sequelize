import { Injectable } from '@nestjs/common';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { RelationRepository } from '@/modules/relations/repositories/relation.repository';
import { RelationListDto } from '@/modules/relations/dtos/relation.lists.dto';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';
import { TableRepository } from '../../table/repositories/table.repository';

@Injectable()
export class RelationService {
  constructor(private relationRepository: RelationRepository, private tableRepository: TableRepository) {}

  public async paginate(
    query: RelationListDto,
  ): Promise<PaginatedResponse<Relation>> {
    return this.relationRepository.paginate(
      {
        ...query.toQueryOptions(),
      },
      query.paginate?.page ?? 1,
    );
  }

  public async lists(query: RelationListDto): Promise<Relation[]> {
    return this.relationRepository.lists(query.toQueryOptions());
  }

  public async create(body: Partial<Relation>): Promise<Relation> {
    const table = await this.tableRepository.findOrFail({ where: { id: body.tableId } });
    if (!table) {
      throw new Error('Table not found');
    }
    return this.relationRepository.create(body);
  }

  public async update(
    id: string,
    body: Partial<Relation>,
  ): Promise<[affectedCount: number, affectedRows: Relation[]]> {
    return this.relationRepository.update({ id }, body);
  }

  public async read(id: string): Promise<Relation> {
    return this.relationRepository.findOrFail({ where: { id } });
  }

  public async delete(id: string, force: boolean = false): Promise<number> {
    return this.relationRepository.delete({ where: { id }, force });
  }
}
