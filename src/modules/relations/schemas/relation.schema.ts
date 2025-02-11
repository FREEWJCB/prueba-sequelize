import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import {
  ModelBase,
  ModelBaseInterface,
} from '@modules/_global/schemas/model.schema';
import { Tables } from '@/modules/table/schemas/table.schema';

export interface RelationInterface extends ModelBaseInterface {
  name: string;
  active: boolean;
  tableId: string;
  table?: Tables;
}
@Table({
  tableName: 'relations',
  timestamps: true,
  paranoid: true,
})
export class Relation extends ModelBase implements RelationInterface {
  @ApiProperty({
    description: 'The relation name',
    type: 'string',
    example: 'Plass',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ApiProperty({
    description: 'The relation active',
    type: 'string',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active!: boolean;

  @ForeignKey(() => Tables)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tableId!: string;

  @BelongsTo(() => Tables, {
    onDelete: 'CASCADE', 
    targetKey: 'id',
  })
  table?: Tables;
}
