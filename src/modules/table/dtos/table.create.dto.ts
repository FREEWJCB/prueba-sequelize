import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Tables } from '@modules/table/schemas/table.schema';
import { I18nTranslations } from '@/i18n/generated';
import { Transform } from 'class-transformer';

export class TableCreateDto implements Record<string, unknown> {
  [key: string]: unknown;
  @ApiProperty({ example: 'Plass', description: 'The table name' })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  public name!: string;

  @ApiPropertyOptional({ example: true, description: 'The table active' })
  @IsOptional()
  @Transform(({ value }): boolean | undefined =>
    value !== undefined ? value === true || value === 'true' : undefined,
  )
  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean'),
  })
  public active?: boolean;

  public toPartial(): Partial<Tables> {
    return <Partial<Tables>>{
      name: this.name,
      active: this.active,
    };
  }
}
