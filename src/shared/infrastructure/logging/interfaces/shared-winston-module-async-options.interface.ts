import type { SharedWinstonLoggerFactoryOptions } from '@/shared/infrastructure/logging/interfaces/shared-winston-logger-factory-options.interface';
import type { ModuleMetadata } from '@nestjs/common';

/**
 * Options for asynchronously configuring the {@link SharedWinstonModule}.
 *
 * Supports the standard NestJS `forRootAsync` signature, allowing dependencies to be injected
 * into the factory for dynamic logger configuration (e.g. using ConfigService).
 *
 * The output of the factory is passed to {@link createSharedWinstonLoggerOptions} to produce
 * Winston logger options.
 *
 * @example
 * ```typescript
 * SharedWinstonModule.forRootAsync({
 *   imports: [ConfigModule],
 *   inject: [ConfigService],
 *   useFactory: (config: ConfigService) => ({
 *     level: config.get('LOG_LEVEL', 'info'),
 *     service: 'api',
 *   }),
 * })
 * ```
 *
 * @see {@link SharedWinstonLoggerFactoryOptions}
 * @see {@link createSharedWinstonLoggerOptions}
 */
export interface SharedWinstonModuleAsyncOptions extends Pick<
  ModuleMetadata,
  'imports'
> {
  /**
   * Dependencies to inject into the factory function.
   *
   * These will be passed to the `useFactory` function as positional arguments.
   */
  inject?: unknown[];

  /**
   * A factory function that returns configuration options for the logger module,
   * either synchronously or asynchronously. The arguments are the injected dependencies.
   *
   * @param args - Injected dependencies specified via `inject`
   * @returns Logger configuration options, or a Promise resolving to them
   */
  useFactory?: (
    ...args: unknown[]
  ) =>
    | Promise<SharedWinstonLoggerFactoryOptions | undefined>
    | SharedWinstonLoggerFactoryOptions
    | undefined;
}
