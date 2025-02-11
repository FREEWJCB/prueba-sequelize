import { Module } from '@nestjs/common';
import { RelationController } from '@/modules/relations/controllers/relation.controller';
import { RelationService } from '@/modules/relations/services/relation.service';
import { RelationRepository } from '@/modules/relations/repositories/relation.repository';
import { Relation } from './schemas/relation.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tables } from '../table/schemas/table.schema';
import { TableRepository } from '../table/repositories/table.repository';

@Module({
  imports: [SequelizeModule.forFeature([Relation, Tables])],
  controllers: [RelationController],
  providers: [
    RelationService,
    RelationRepository,
    TableRepository,
  ],
  exports: [RelationService],
})
export class RelationModule {}
