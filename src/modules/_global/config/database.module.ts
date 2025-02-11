import { Module } from '@nestjs/common';
import { databaseProviders } from '@modules/_global/config/database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
