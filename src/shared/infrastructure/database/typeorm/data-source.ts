import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

/**
 * Reads a required env var for TypeORM CLI usage (migrations). Not used by Nest at startup.
 */
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing environment variable "${name}" for TypeORM CLI data source`,
    );
  }
  return value;
}

const rootFromThisFile = join(__dirname, '/../../../../');

/**
 * TypeORM DataSource options for the CLI (`typeorm -d ...`).
 * Keep env vars aligned with {@link buildTypeOrmModuleOptions}.
 */
export const dataSourceOptions: DataSourceOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- driver from env
  type: requiredEnv('DATABASE_DRIVER') as any,
  host: requiredEnv('DATABASE_HOST'),
  port: Number(requiredEnv('DATABASE_PORT')),
  username: requiredEnv('DATABASE_USERNAME'),
  password: requiredEnv('DATABASE_PASSWORD'),
  database: requiredEnv('DATABASE_DATABASE'),
  entities: [join(rootFromThisFile, '**/*-typeorm.entity{.ts,.js}')],
  migrations: [join(rootFromThisFile, 'migrations/*{.ts,.js}')],
  migrationsTableName:
    process.env.DATABASE_MIGRATIONS_TABLE_NAME ?? 'migrations',
  migrationsRun: false,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV !== 'production',
  extra: {
    connectionLimit: 10,
  },
};

export const dataSource = new DataSource(dataSourceOptions);
