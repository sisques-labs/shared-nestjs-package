import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { buildTypeOrmModuleOptions } from '@/shared/infrastructure/database/typeorm/typeorm-module-options.factory';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

const SERVICES = [TypeormMasterService];
const SUBSCRIBERS = [];

/**
 * Opt-in TypeORM integration. Import this module only in apps that use TypeORM.
 * Requires `ConfigModule` (e.g. `ConfigModule.forRoot({ isGlobal: true })`) and the usual `DATABASE_*` variables.
 */
@Global()
@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmModuleOptions(configService),
    }),
  ],
  providers: [...SERVICES, ...SUBSCRIBERS],
  exports: [...SERVICES],
})
export class TypeOrmModule {}
