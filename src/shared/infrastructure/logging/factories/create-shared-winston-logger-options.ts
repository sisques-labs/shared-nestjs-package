import * as winston from 'winston';
// Side effect: registers `DailyRotateFile` on `winston.transports` (same pattern as a local winston.config.ts).
import 'winston-daily-rotate-file';

import {
  createSharedConsoleLogFormat,
  createSharedJsonLogFormat,
} from '@/shared/infrastructure/logging/formats/shared-winston.formats';
import type { SharedWinstonLoggerFactoryOptions } from '@/shared/infrastructure/logging/interfaces/shared-winston-logger-factory-options.interface';

/**
 * Utility function to ensure a given value is always returned as an array of winston transports.
 *
 * @param transportOrList - A single winston transport or an array of transports (may be undefined).
 * @returns An array of winston transports.
 * @internal
 */
function asTransportArray(
  transportOrList?: winston.transport | winston.transport[],
): winston.transport[] {
  if (transportOrList == null) {
    return [];
  }
  return Array.isArray(transportOrList) ? transportOrList : [transportOrList];
}

type DailyRotateFileTransport = new (options: object) => winston.transport;

function getWinstonDailyRotateFile(): DailyRotateFileTransport {
  const ctor = (
    winston.transports as { DailyRotateFile?: DailyRotateFileTransport }
  ).DailyRotateFile;
  if (ctor == null) {
    throw new Error(
      'winston.transports.DailyRotateFile is missing. Install peer dependency winston-daily-rotate-file; it must load after winston (this package imports it as a side effect).',
    );
  }
  return ctor;
}

/**
 * Creates Winston logger options with a sensible, production-ready combination of transports and formats.
 *
 * - By default, uses:
 *   - JSON logs to a daily-rotating file (handled via `winston-daily-rotate-file`)
 *   - Colored, human-friendly logs to the console
 * - Designed to match the standard NestJS + nest-winston integration
 *
 * @param options - Logger configuration options. See {@link SharedWinstonLoggerFactoryOptions} for details.
 *   - `level`: Minimum log level.
 *   - `defaultMeta`: Static metadata added to every log.
 *   - `service`: Service name, defaults to `'api'` if not provided.
 *   - `jsonLogFormat` / `consoleFormat`: Custom winston formats for file/console.
 *   - `dailyRotate`: Configuration for daily file rotation.
 *   - `enableConsole`: Enable/disable console transport (default: true).
 *   - `enableDailyRotateFile`: Enable/disable daily-rotating file (default: true).
 *   - `additionalTransports`: Any extra custom winston transports.
 *   - `exceptionHandlers` / `rejectionHandlers`: Error handling transports.
 *
 * @returns Winston LoggerOptions suitable for use with `nest-winston` or plain `winston.createLogger`.
 *
 * @example
 * ```
 * createSharedWinstonLoggerOptions({ service: 'my-app', level: 'debug' })
 * ```
 */
export function createSharedWinstonLoggerOptions(
  options: SharedWinstonLoggerFactoryOptions = {},
): winston.LoggerOptions {
  const jsonFormat = options.jsonLogFormat ?? createSharedJsonLogFormat();
  const consoleFormat = options.consoleFormat ?? createSharedConsoleLogFormat();

  const level = options.level ?? process.env.LOG_LEVEL ?? 'info';

  // Compose defaultMeta, guaranteeing a `service` property even if missing
  const defaultMeta: Record<string, unknown> = {
    ...(options.defaultMeta ?? {}),
  };
  if (options.service !== undefined && defaultMeta.service === undefined) {
    defaultMeta.service = options.service;
  }
  if (Object.keys(defaultMeta).length === 0) {
    defaultMeta.service = 'api';
  }

  const dailyRotateOptions = options.dailyRotate ?? {};
  const transports: winston.transport[] = [];

  // Add colored console logger unless explicitly disabled
  if (options.enableConsole !== false) {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
      }),
    );
  }

  // Add daily-rotating JSON file unless explicitly disabled
  if (options.enableDailyRotateFile !== false) {
    const DailyRotateFile = getWinstonDailyRotateFile();
    transports.push(
      new DailyRotateFile({
        filename: dailyRotateOptions.filename ?? 'logs/%DATE%.log',
        datePattern: dailyRotateOptions.datePattern ?? 'YYYY-MM-DD',
        zippedArchive: dailyRotateOptions.zippedArchive ?? true,
        maxSize: dailyRotateOptions.maxSize ?? '20m',
        maxFiles: dailyRotateOptions.maxFiles ?? '14d',
        format: dailyRotateOptions.format ?? jsonFormat,
      }),
    );
  }

  // Add any custom user-provided transports last
  transports.push(...(options.additionalTransports ?? []));

  return {
    level,
    format: jsonFormat,
    defaultMeta,
    transports,
    exceptionHandlers: options.exceptionHandlers ?? [],
    rejectionHandlers: options.rejectionHandlers ?? [],
  };
}

/**
 * Merges two Winston LoggerOptions into a new options object.
 *
 * - Shallow-merges most properties (overrides base using right-hand/override).
 * - Concatenates all transports (preserving both base and override).
 * - Merges `defaultMeta` objects shallowly (right-hand wins on conflict).
 * - Overwrites `exceptionHandlers` and `rejectionHandlers` only if defined in the override.
 *
 * Useful for extending/modifying logger configuration after initial creation, e.g., to add transports or adjust defaults.
 *
 * @param baseLoggerOptions - The original logger options.
 * @param overrideLoggerOptions - Override options to apply.
 * @returns Combined Winston LoggerOptions with merged transports and meta.
 *
 * @example
 * ```
 * const base = createSharedWinstonLoggerOptions();
 * const merged = mergeSharedWinstonLoggerOptions(base, {
 *   level: 'debug',
 *   additionalTransports: [myExtraTransport],
 * });
 * ```
 */
export function mergeSharedWinstonLoggerOptions(
  baseLoggerOptions: winston.LoggerOptions,
  overrideLoggerOptions: Partial<winston.LoggerOptions>,
): winston.LoggerOptions {
  // Shallow copy and merge meta
  const baseDefaultMeta =
    typeof baseLoggerOptions.defaultMeta === 'object' &&
    baseLoggerOptions.defaultMeta !== null
      ? { ...(baseLoggerOptions.defaultMeta as Record<string, unknown>) }
      : {};
  const overrideDefaultMeta =
    typeof overrideLoggerOptions.defaultMeta === 'object' &&
    overrideLoggerOptions.defaultMeta !== null
      ? { ...(overrideLoggerOptions.defaultMeta as Record<string, unknown>) }
      : {};

  const mergedLoggerOptions: winston.LoggerOptions = {
    ...baseLoggerOptions,
    ...overrideLoggerOptions,
    defaultMeta: { ...baseDefaultMeta, ...overrideDefaultMeta },
    transports: [
      ...asTransportArray(baseLoggerOptions.transports),
      ...asTransportArray(overrideLoggerOptions.transports),
    ],
  };

  // Intentionally only override handlers if explicitly defined in `overrideLoggerOptions`
  if (overrideLoggerOptions.exceptionHandlers !== undefined) {
    mergedLoggerOptions.exceptionHandlers =
      overrideLoggerOptions.exceptionHandlers;
  }
  if (overrideLoggerOptions.rejectionHandlers !== undefined) {
    mergedLoggerOptions.rejectionHandlers =
      overrideLoggerOptions.rejectionHandlers;
  }

  return mergedLoggerOptions;
}

/**
 * Default {@link winston.LoggerOptions} from {@link createSharedWinstonLoggerOptions} with no overrides.
 * Pass to `WinstonModule.forRoot(...)` from `nest-winston` in the consuming application.
 *
 * Prefer calling {@link createSharedWinstonLoggerOptions} inside `WinstonModule.forRootAsync` when levels,
 * paths, or service name must come from `ConfigService` or other async setup.
 */
export const defaultSharedWinstonLoggerOptions: winston.LoggerOptions =
  createSharedWinstonLoggerOptions();
