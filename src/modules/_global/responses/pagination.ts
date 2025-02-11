import { ApiProperty } from '@nestjs/swagger';

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage?: number;
  limit: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: PaginationMetaResponse;
}

export class PaginationMetaResponse implements PaginationMeta {
  @ApiProperty({
    description: 'Total number of records',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Last page number',
    example: 10,
  })
  lastPage?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
  })
  limit!: number;
}
export class PaginatedResponse<T> implements IPaginatedResponse<T> {
  @ApiProperty({
    description: 'List of records',
    isArray: true,
  })
  data!: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaResponse,
  })
  meta!: PaginationMetaResponse;
}
