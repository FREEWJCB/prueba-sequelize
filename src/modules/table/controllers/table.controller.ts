import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Get,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { TableCreateDto } from '@/modules/table/dtos/table.create.dto';
import { TableListDto } from '@/modules/table/dtos/table.lists.dto';
import { Tables } from '@/modules/table/schemas/table.schema';
import { TableService } from '@/modules/table/services/table.service';
import { TableUpdateDto } from '@/modules/table/dtos/table.update.dto';
import { DeleteDto } from '@/modules/_global/dtos/delete.dto';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';

@Controller()
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  @ApiOperation({ summary: 'List of tables' })
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(PaginatedResponse<Tables>),
          description: 'List paginate of tables',
        },
        {
          $ref: getSchemaPath(Tables),
          description: 'List of tables',
        },
      ],
    },
  })
  public async index(
    @Query() query: TableListDto,
    @Res() response: Response,
  ): Promise<Response> {
    if (query.paginate) {
      return response
        .status(HttpStatus.OK)
        .json(await this.tableService.paginate(query));
    }
    return response
      .status(HttpStatus.OK)
      .json(await this.tableService.lists(query));
  }

  @Post()
  @ApiOperation({ summary: 'Create table' })
  @ApiCreatedResponse({
    description: 'Table recently created',
    type: Tables,
  })
  public async create(
    @Body() body: TableCreateDto,
    @Res() response: Response,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(await this.tableService.create(body.toPartial()));
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Find table by id',
    description: 'Find table record by id',
  })
  @ApiOkResponse({
    description: 'The table record',
    type: Tables,
  })
  public async read(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.tableService.read(id));
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Find table by id and update' })
  @ApiCreatedResponse({
    description: 'Table recently updated',
    type: Tables,
  })
  /// ToDo: (Update integrable)
  /// Need to delete all related entities with sync_id
  public async update(
    @Param('id') id: string,
    @Body() body: TableUpdateDto,
    @Res() response: Response,
  ): Promise<Response> {
    const table = await this.tableService.update(id, body.toPartial());
    return response
      .status(HttpStatus.OK)
      .json(table);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Find table by id and delete' })
  @ApiOkResponse({
    description: 'Delete result',
  })
  public async delete(
    @Param('id') id: string,
    @Body() dto: DeleteDto,
    @Res() response: Response,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.tableService.delete(id, dto.force));
  }
}
