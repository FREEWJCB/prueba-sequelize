import { Module } from '@nestjs/common';
import { TableController } from '@/modules/table/controllers/table.controller';
import { TableService } from '@/modules/table/services/table.service';
import { TableRepository } from '@/modules/table/repositories/table.repository';
import { Tables } from './schemas/table.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { Relation } from '../relations/schemas/relation.schema';

@Module({
  imports: [SequelizeModule.forFeature([Tables, Relation])],
  controllers: [TableController],
  providers: [TableService, TableRepository],
  exports: [TableService],
})
export class TableModule {}
