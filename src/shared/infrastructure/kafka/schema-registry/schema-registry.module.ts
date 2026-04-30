import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchemaRegistryService } from './schema-registry.service';
import { SCHEMA_REGISTRY_OPTIONS } from './schema-registry.constants';
import {
  ISchemaRegistryAsyncOptions,
  ISchemaRegistryOptions,
} from './schema-registry-options.interface';

@Module({})
export class SchemaRegistryModule {
  static forRoot(options: ISchemaRegistryOptions): DynamicModule {
    return {
      module: SchemaRegistryModule,
      imports: [HttpModule],
      providers: [
        { provide: SCHEMA_REGISTRY_OPTIONS, useValue: options },
        SchemaRegistryService,
      ],
      exports: [SchemaRegistryService],
    };
  }

  static forRootAsync(options: ISchemaRegistryAsyncOptions): DynamicModule {
    return {
      module: SchemaRegistryModule,
      imports: [HttpModule, ...(options.imports ?? [])],
      providers: [
        {
          provide: SCHEMA_REGISTRY_OPTIONS,
          inject: options.inject ?? [],
          useFactory: options.useFactory,
        },
        SchemaRegistryService,
      ],
      exports: [SchemaRegistryService],
    };
  }
}
