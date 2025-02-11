import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import { I18nTranslations } from '@/i18n/generated';

export class ModelNotFoundResponse implements Record<string, unknown> {
  [key: string]: unknown;
  @ApiProperty({
    description: 'Response status code',
    example: HttpStatus.NOT_FOUND,
  })
  public statusCode!: number;

  @ApiProperty({
    description: 'Response message',
    example:
      'The id [64259c2ac729d7c3ff397d91] was not found in the model [{model}]',
  })
  public message!: string;

  public static fromModelNotFound(
    model: string,
    id: string,
  ): ModelNotFoundResponse {
    return <ModelNotFoundResponse>{
      statusCode: HttpStatus.NOT_FOUND,
      message: I18nContext.current<I18nTranslations>()?.t(
        'response.MODEL_NOT_FOUND',
        {
          args: {
            model,
            id,
          },
        },
      ),
    };
  }
}
