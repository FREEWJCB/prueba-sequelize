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
import { RelationFiltersDto } from '@/modules/relations/dtos/filters/relation.filters.dto';
import { RelationSortDto } from '@/modules/relations/dtos/filters/relation.sort.dto';
import { PaginateDto } from '@modules/_global/dtos/paginate.dto';
import { withoutEmpty } from '@/modules/_global/functions/sanitize';
import { Relation } from '@modules/relations/schemas/relation.schema';
import { I18nTranslations } from '@/i18n/generated';
import { FindOptions } from 'sequelize';
export interface RelationListDtoConstructor {
  filters?: RelationFiltersDto | undefined;
  sort?: RelationSortDto | undefined;
  paginate?: PaginateDto | undefined;
  limit?: number | undefined;
}
export class RelationListDto implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(dto: RelationListDtoConstructor | undefined = undefined) {
    this.filters = dto?.filters;
    this.sort = dto?.sort;
    this.paginate = dto?.paginate;
    this.limit = dto?.limit;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Filter options',
    type: RelationFiltersDto,
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
  @Type(() => RelationFiltersDto)
  public filters?: RelationFiltersDto | undefined;

  @Expose()
  @ApiPropertyOptional({
    description: 'Sort options',
    type: RelationSortDto,
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
  @Type(() => RelationSortDto)
  public sort?: RelationSortDto | undefined;

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

  public toQueryOptions(): FindOptions<Relation> {
    return withoutEmpty<FindOptions<Relation>>(<FindOptions<Relation>>{
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
