import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('POSTGRES_HOST'),
    username: config.get<string>('POSTGRES_USER'),
    password: config.get<string>('POSTGRES_PASSWORD'),
    database: config.get<string>('POSTGRES_DB'),
    port: config.get<number>('POSTGRES_PORT'),
    entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
    migrationsRun: false,
    migrationsTableName: 'migration',
    migrations: [
      __dirname + '/migration/**/*.ts',
      __dirname + '/migration/**/*.js',
    ],
    cli: {
      migrationsDir: 'src/migration',
    },
  }),
} as TypeOrmModuleOptions;
