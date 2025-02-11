import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { castToQueryFilter } from '@/modules/_global/functions/instance.check';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/generated';
import { WhereOptions, Op } from 'sequelize';

interface RelationFiltersDtoConstructor {
  name?: string;
  active?: boolean;
  table_id?: string;
}
export class RelationFiltersDto implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(dto: RelationFiltersDtoConstructor | undefined = undefined) {
    this.name = dto?.name;
    this.active = dto?.active;
    this.table_id = dto?.table_id;
  }

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[name]',
    description: 'Filter by relation name',
    example: 'Plass',
  })
  @IsOptional()
  @IsString({ each: true })
  public name?: string | undefined;

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[active]',
    description: 'Filter by relation active',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }): boolean | undefined =>
    value !== undefined ? value === true || value === 'true' : undefined,
  )
  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean'),
  })
  public active?: boolean | undefined;

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[table_id]',
    description: 'Filter by table_id',
    example: '3sT8xoJxiMSrZK6xQgvbhUJehoD2',
  })
  @IsOptional()
  @IsString({ each: true })
  public table_id?: string | undefined;

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[table_name]',
    description: 'Filter by table name',
    example: 'Plass',
  })
  @IsOptional()
  @IsString()
  public table_name?: string;

  @Type()
  public toQueryFilter(): WhereOptions<Relation> {
    return castToQueryFilter<Relation, RelationFiltersDto>(
      this,
      ['name', 'active', 'table_id', 'table_name'],
      (key, query) => {
        switch (key) {
          case 'name':
            query = { ...query, name: { [Op.iLike]: `%${this[key]!}%` } };
            break;
          case 'active':
            query = { ...query, active: this[key]! };
            break;
          case 'table_id':
            query = { ...query, tableId: this[key]! };
            break;
          case 'table_name':
            query = { ...query, '$table.name$': { [Op.iLike]: `%${this[key]!}%` } };
            break;
        }
        return query;
      },
    );
  }
}
