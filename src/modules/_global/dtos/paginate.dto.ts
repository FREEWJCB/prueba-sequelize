import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

interface PaginateDtoConstructor {
  page?: number;
}

// noinspection TypeScriptValidateTypes
export class PaginateDto implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(dto: PaginateDtoConstructor | undefined = undefined) {
    this.page = dto?.page;
  }

  @Expose()
  @ApiPropertyOptional({
    name: 'paginate[page]',
    description: 'Page number',
    type: () => Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  page?: number | undefined;
}
