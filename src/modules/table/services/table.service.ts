import { Injectable } from '@nestjs/common';
import { Tables } from '@/modules/table/schemas/table.schema';
import { TableRepository } from '@/modules/table/repositories/table.repository';
import { TableListDto } from '@/modules/table/dtos/table.lists.dto';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';

@Injectable()
export class TableService {
  constructor(private tableRepository: TableRepository) {}

  public async paginate(
    query: TableListDto,
  ): Promise<PaginatedResponse<Tables>> {
    return this.tableRepository.paginate(
      {
        ...query.toQueryOptions(),
      },
      query.paginate?.page ?? 1,
    );
  }

  public async lists(query: TableListDto): Promise<Tables[]> {
    return this.tableRepository.lists(query.toQueryOptions());
  }

  public async create(body: Partial<Tables>): Promise<Tables> {
    return this.tableRepository.create(body);
  }

  public async update(
    id: string,
    body: Partial<Tables>,
  ): Promise<[affectedCount: number, affectedRows: Tables[]]> {
    return this.tableRepository.update({ id }, body);
  }

  public async read(id: string): Promise<Tables> {
    return this.tableRepository.findOrFail({ where: { id } });
  }

  public async delete(id: string, force: boolean = false): Promise<number> {
    return this.tableRepository.delete({ where: { id }, force });
  }
}
