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

import { RelationCreateDto } from '@/modules/relations/dtos/relation.create.dto';
import { RelationListDto } from '@/modules/relations/dtos/relation.lists.dto';
import { Relation } from '@/modules/relations/schemas/relation.schema';
import { RelationService } from '@/modules/relations/services/relation.service';
import { RelationUpdateDto } from '@/modules/relations/dtos/relation.update.dto';
import { DeleteDto } from '@/modules/_global/dtos/delete.dto';
import { PaginatedResponse } from '@/modules/_global/responses/pagination';

@Controller('relation/')
export class RelationController {
  constructor(private readonly relationService: RelationService) {}

  @Get()
  @ApiOperation({ summary: 'List of relations' })
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(PaginatedResponse<Relation>),
          description: 'List paginate of relations',
        },
        {
          $ref: getSchemaPath(Relation),
          description: 'List of relations',
        },
      ],
    },
  })
  public async index(
    @Query() query: RelationListDto,
    @Res() response: Response,
  ): Promise<Response> {
    if (query.paginate) {
      return response
        .status(HttpStatus.OK)
        .json(await this.relationService.paginate(query));
    }
    return response
      .status(HttpStatus.OK)
      .json(await this.relationService.lists(query));
  }

  @Post()
  @ApiOperation({ summary: 'Create relation' })
  @ApiCreatedResponse({
    description: 'Relation recently created',
    type: Relation,
  })
  public async create(
    @Body() body: RelationCreateDto,
    @Res() response: Response,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(await this.relationService.create(body.toPartial()));
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Find relation by id',
    description: 'Find relation record by id',
  })
  @ApiOkResponse({
    description: 'The relation record',
    type: Relation,
  })
  public async read(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.relationService.read(id));
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Find relation by id and update' })
  @ApiCreatedResponse({
    description: 'Relation recently updated',
    type: Relation,
  })
  /// ToDo: (Update integrable)
  /// Need to delete all related entities with sync_id
  public async update(
    @Param('id') id: string,
    @Body() body: RelationUpdateDto,
    @Res() response: Response,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.relationService.update(id, body.toPartial()));
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Find relation by id and delete' })
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
      .json(await this.relationService.delete(id, dto.force));
  }
}
