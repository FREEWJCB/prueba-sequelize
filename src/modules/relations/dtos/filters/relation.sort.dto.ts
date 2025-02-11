import { SortEnum, SortOrder } from '@modules/_global/constants/sort.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/generated';

interface RelationSortDtoConstructor {
  created_at?: SortOrder;
  name?: SortOrder;
}

export class RelationSortDto implements Record<string, SortOrder> {
  [key: string]: SortOrder;

  constructor(dto: RelationSortDtoConstructor | undefined = undefined) {
    if (dto?.created_at) {
      this.created_at = dto.created_at;
    }
    if (dto?.name) {
      this.name = dto.name;
    }
  }

  @Expose()
  @ApiPropertyOptional({
    name: 'sort[created_at]',
    description: 'Sort by created_at',
    enum: SortEnum,
  })
  @IsOptional()
  @IsEnum(SortEnum, {
    message: i18nValidationMessage<I18nTranslations>('validation.isEnum'),
  })
  public created_at?: SortOrder;

  @Expose()
  @ApiPropertyOptional({
    name: 'sort[name]',
    description: 'Sort by name',
    enum: SortEnum,
  })
  @IsOptional()
  @IsEnum(SortEnum, {
    message: i18nValidationMessage<I18nTranslations>('validation.isEnum'),
  })
  public name?: SortOrder;
}
