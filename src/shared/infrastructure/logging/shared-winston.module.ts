import { DynamicModule, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { createSharedWinstonLoggerOptions } from '@/shared/infrastructure/logging/factories/create-shared-winston-logger-options';
import type { SharedWinstonLoggerFactoryOptions } from '@/shared/infrastructure/logging/interfaces/shared-winston-logger-factory-options.interface';
import type { SharedWinstonModuleAsyncOptions } from '@/shared/infrastructure/logging/interfaces/shared-winston-module-async-options.interface';

@Module({})
export class SharedWinstonModule {
  static forRoot(
    options: SharedWinstonLoggerFactoryOptions = {},
  ): DynamicModule {
    return {
      module: SharedWinstonModule,
      imports: [
        WinstonModule.forRoot(createSharedWinstonLoggerOptions(options)),
      ],
      exports: [WinstonModule],
    };
  }

  static forRootAsync(options: SharedWinstonModuleAsyncOptions): DynamicModule {
    const inject = options.inject ?? [];
    const useFactory = options.useFactory;

    return {
      module: SharedWinstonModule,
      imports: [
        WinstonModule.forRootAsync({
          imports: options.imports,
          inject,
          useFactory: async (...args: unknown[]) => {
            const partial =
              useFactory != null ? await useFactory(...args) : undefined;
            return createSharedWinstonLoggerOptions(partial ?? {});
          },
        }),
      ],
      exports: [WinstonModule],
    };
  }
}
