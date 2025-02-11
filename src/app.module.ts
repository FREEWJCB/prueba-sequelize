import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TableModule } from '@/modules/table/table.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tables } from '@/modules/table/schemas/table.schema';
import { RelationModule } from './modules/relations/relation.module';
import { Relation } from './modules/relations/schemas/relation.schema';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';

export const fallbackLanguage = 'es';

@Module({
  imports: [
    // DatabaseModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env['DB_HOST']!,
      port: Number(process.env['DB_PORT']!),
      username: process.env['DB_USERNAME']!,
      password: process.env['DB_PASSWORD']!,
      database: `${process.env['DB_PREFIX']!}_${process.env['APP_STAGE']!}`,
      models: [Tables, Relation],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: fallbackLanguage,
      loaderOptions: {
        fallbacks: {
          'es-*': 'es',
          'en-*': 'en',
        },
        path: path.join(__dirname, 'i18n/'),
        watch: true,
        logging: process.env['APP_STAGE'] === 'development',
      },
      resolvers: [
        { use: HeaderResolver, options: ['language'] },
        AcceptLanguageResolver,
      ],
    }),
    RelationModule,
    TableModule,
  ],
})
export class AppModule {}
