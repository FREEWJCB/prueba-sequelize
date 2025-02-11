import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import {
  ModelBase,
  ModelBaseInterface,
} from '@modules/_global/schemas/model.schema';
import { Relation } from '@/modules/relations/schemas/relation.schema';

export interface TableInterface extends ModelBaseInterface {
  name: string;
  active: boolean;
  relations?: Relation[];
}
@Table({
  tableName: 'tables',
  timestamps: true,
  paranoid: true,
})
export class Tables extends ModelBase implements TableInterface {
  @ApiProperty({
    description: 'The table name',
    type: 'string',
    example: 'Plass',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ApiProperty({
    description: 'The table active',
    type: 'string',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active!: boolean;

  @HasMany(() => Relation, {
    foreignKey: 'tableId',
    sourceKey: 'id',
  })
  relations?: Relation[];
}
