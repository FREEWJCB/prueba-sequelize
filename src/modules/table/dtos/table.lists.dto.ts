import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TableFiltersDto } from '@/modules/table/dtos/filters/table.filters.dto';
import { TableSortDto } from '@/modules/table/dtos/filters/table.sort.dto';
import { PaginateDto } from '@modules/_global/dtos/paginate.dto';
import { withoutEmpty } from '@/modules/_global/functions/sanitize';
import { Tables } from '@modules/table/schemas/table.schema';
import { I18nTranslations } from '@/i18n/generated';
import { FindOptions } from 'sequelize';
export interface TableListDtoConstructor {
  filters?: TableFiltersDto | undefined;
  sort?: TableSortDto | undefined;
  paginate?: PaginateDto | undefined;
  limit?: number | undefined;
}
export class TableListDto implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(dto: TableListDtoConstructor | undefined = undefined) {
    this.filters = dto?.filters;
    this.sort = dto?.sort;
    this.paginate = dto?.paginate;
    this.limit = dto?.limit;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Filter options',
    type: TableFiltersDto,
  })
  @IsOptional()
  @IsNotEmptyObject(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsObject({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @ValidateNested({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @Type(() => TableFiltersDto)
  public filters?: TableFiltersDto | undefined;

  @Expose()
  @ApiPropertyOptional({
    description: 'Sort options',
    type: TableSortDto,
  })
  @IsOptional()
  @IsNotEmptyObject(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsObject({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @ValidateNested({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @Type(() => TableSortDto)
  public sort?: TableSortDto | undefined;

  @ApiPropertyOptional({
    description: 'Paginate options',
    type: PaginateDto,
  })
  @IsOptional()
  @IsNotEmptyObject(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsObject({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @ValidateNested({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @Type()
  @Expose()
  public paginate?: PaginateDto | undefined;

  @ApiPropertyOptional({
    description: 'Limit records',
    example: 50,
  })
  @IsOptional()
  @Transform((params) => (params.value ? Number(params.value) : undefined))
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(100)
  public limit?: number | undefined;

  public toQueryOptions(): FindOptions<Tables> {
    return withoutEmpty<FindOptions<Tables>>(<FindOptions<Tables>>{
      ...(this.filters && { where: this.filters?.toQueryFilter() }),
      ...(this.paginate?.page && { page: this.paginate?.page }),
      // order: this.sort,
      limit: this.limit ?? 10,
    });
  }

  public prueba(): string {
    return 'hola';
  }
}
