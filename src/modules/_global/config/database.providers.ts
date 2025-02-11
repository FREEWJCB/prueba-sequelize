import { Sequelize } from 'sequelize-typescript';
import { Tables } from '@/modules/table/schemas/table.schema';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: '192.168.0.8',
        port: 5432,
        username: 'admin',
        password: 'local123',
        database: 'nb_hub_local',
        models: [Tables],
      });
      sequelize.addModels([Tables]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
