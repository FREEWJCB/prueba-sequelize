import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Tables } from '@/modules/table/schemas/table.schema';
import { castToQueryFilter } from '@/modules/_global/functions/instance.check';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/generated';
import { WhereOptions, Op } from 'sequelize';

interface TableFiltersDtoConstructor {
  name?: string;
  active?: boolean;
}
export class TableFiltersDto implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(dto: TableFiltersDtoConstructor | undefined = undefined) {
    this.name = dto?.name;
    this.active = dto?.active;
  }

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[name]',
    description: 'Filter by table name',
    example: 'Plass',
  })
  @IsOptional()
  @IsString({ each: true })
  public name?: string | undefined;

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[active]',
    description: 'Filter by table active',
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

  @Type()
  public toQueryFilter(): WhereOptions<Tables> {
    return castToQueryFilter<Tables, TableFiltersDto>(
      this,
      ['name', 'active'],
      (key, query) => {
        switch (key) {
          case 'name':
            query = { ...query, name: { [Op.iLike]: `%${this[key]!}%` } };
            break;
          case 'active':
            query = { ...query, active: this[key]! };
            break;
        }
        return query;
      },
    );
  }
}
