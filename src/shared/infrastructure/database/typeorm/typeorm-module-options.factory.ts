import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

/**
 * Resolves entity and migration glob paths relative to compiled output (`dist/.../typeorm/`).
 */
function typeOrmCliPaths() {
  const rootFromThisFile = join(__dirname, '/../../../../');
  return {
    entities: [join(rootFromThisFile, '**/*-typeorm.entity{.ts,.js}')],
    migrations: [join(rootFromThisFile, 'migrations/*{.ts,.js}')],
  };
}

/**
 * Builds Nest `TypeOrmModule` options from `ConfigService`.
 * Call only from `TypeOrmModule.forRootAsync` (or tests)—not at module top level.
 */
export function buildTypeOrmModuleOptions(
  config: ConfigService,
): TypeOrmModuleOptions {
  const { entities, migrations } = typeOrmCliPaths();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- driver string from env
    type: config.getOrThrow<string>('DATABASE_DRIVER') as any,
    host: config.getOrThrow<string>('DATABASE_HOST'),
    port: Number(config.getOrThrow<string>('DATABASE_PORT')),
    username: config.getOrThrow<string>('DATABASE_USERNAME'),
    password: config.getOrThrow<string>('DATABASE_PASSWORD'),
    database: config.getOrThrow<string>('DATABASE_DATABASE'),
    entities,
    migrations,
    migrationsTableName:
      config.get<string>('DATABASE_MIGRATIONS_TABLE_NAME') ?? 'migrations',
    migrationsRun: false,
    synchronize: config.get<string>('DATABASE_SYNCHRONIZE') === 'true',
    logging: config.get<string>('NODE_ENV') !== 'production',
    extra: {
      connectionLimit: 10,
    },
  };
}
