import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Relation } from '@modules/relations/schemas/relation.schema';
import { I18nTranslations } from '@/i18n/generated';
import { Transform } from 'class-transformer';

export class RelationCreateDto implements Record<string, unknown> {
  [key: string]: unknown;
  @ApiProperty({ example: 'Plass', description: 'The relation name' })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  public name!: string;

  @ApiPropertyOptional({ example: true, description: 'The relation active' })
  @IsOptional()
  @Transform(({ value }): boolean | undefined =>
    value !== undefined ? value === true || value === 'true' : undefined,
  )
  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean'),
  })
  public active?: boolean;

  @ApiProperty({
    example: '3sT8xoJxiMSrZK6xQgvbhUJehoD2',
    description: 'The table id',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  public table_id!: string;

  public toPartial(): Partial<Relation> {
    return <Partial<Relation>>{
      name: this.name,
      active: this.active,
      tableId: this.table_id,
    };
  }
}
