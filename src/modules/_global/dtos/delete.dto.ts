import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

import { I18nTranslations } from '@/i18n/generated';

export class DeleteDto implements Record<string, unknown> {
  [key: string]: unknown;

  @ApiPropertyOptional({ type: Boolean, description: 'Force delete' })
  @IsOptional()
  @Transform(({ value }): boolean | undefined =>
    value !== undefined ? value === true || value === 'true' : undefined,
  )
  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean'),
  })
  public force?: boolean;
}
