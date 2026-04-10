import type winston from 'winston';

/**
 * @typedef SharedWinstonLoggerFactoryOptions
 *
 * Options object for {@link createSharedWinstonLoggerOptions}. All properties are optional and will use library defaults if omitted.
 *
 * @property {string} [level] - Minimum log level for output (e.g., `'info'`, `'debug'`, `'warn'`).
 * @property {Record<string, unknown>} [defaultMeta] - Static metadata to add to every log (e.g., `{ foo: 'bar' }`).
 * @property {string} [service] - Shorthand for `defaultMeta.service` when `defaultMeta` is not set. Defaults to `'api'`.
 * @property {boolean} [enableConsole] - If `true`, enables the console transport. Defaults to `true`.
 * @property {boolean} [enableDailyRotateFile] - If `true`, enables daily-rotating file logging. Defaults to `true`.
 * @property {object} [dailyRotate] - Configuration options for the daily rotating file transport.
 * @property {string} [dailyRotate.filename] - File path/pattern for rotated logs (default: `'logs/%DATE%.log'`).
 * @property {string} [dailyRotate.datePattern] - Date pattern for files (default: `'YYYY-MM-DD'`).
 * @property {boolean} [dailyRotate.zippedArchive] - Whether to gzip older logs (default: `true`).
 * @property {string} [dailyRotate.maxSize] - Maximum size per log file before rotation (default: `'20m'`).
 * @property {string} [dailyRotate.maxFiles] - Maximum number of files or days to keep (default: `'14d'`).
 * @property {winston.Logform.Format} [dailyRotate.format] - Custom log format for file transport. Defaults to the shared JSON format.
 * @property {winston.transport[]} [additionalTransports] - Custom transports to append after the default console and daily-rotate transports.
 * @property {winston.transport[]} [exceptionHandlers] - Transports to handle uncaught exceptions.
 * @property {winston.transport[]} [rejectionHandlers] - Transports to handle unhandled promise rejections.
 * @property {winston.Logform.Format} [jsonLogFormat] - CUSTOM: Override default JSON log format for file transport.
 * @property {winston.Logform.Format} [consoleFormat] - CUSTOM: Override default human-friendly log format for the console.
 */
export interface SharedWinstonLoggerFactoryOptions {
  /**
   * Minimum log level for output (e.g., `'info'`, `'debug'`, `'warn'`).
   */
  level?: string;
  /**
   * Static metadata to add to every log (e.g., `{ foo: 'bar' }`).
   */
  defaultMeta?: Record<string, unknown>;
  /**
   * Shorthand for `defaultMeta.service` when `defaultMeta` is not set. Defaults to `'api'`.
   */
  service?: string;
  /**
   * Enables the console transport if `true`. Defaults to `true`.
   */
  enableConsole?: boolean;
  /**
   * Enables daily-rotating file logging if `true`. Defaults to `true`.
   */
  enableDailyRotateFile?: boolean;
  /**
   * Configuration options for the daily rotating file transport.
   */
  dailyRotate?: {
    /**
     * File path/pattern for rotated logs (default: `'logs/%DATE%.log'`).
     */
    filename?: string;
    /**
     * Date pattern for filenames (default: `'YYYY-MM-DD'`).
     */
    datePattern?: string;
    /**
     * Whether to gzip older logs (default: `true`).
     */
    zippedArchive?: boolean;
    /**
     * Maximum size per log file before rotation (default: `'20m'`).
     */
    maxSize?: string;
    /**
     * Maximum number of files or days to keep (default: `'14d'`).
     */
    maxFiles?: string;
    /**
     * Custom log format for file transport. Defaults to the shared JSON format.
     */
    format?: winston.Logform.Format;
  };
  /**
   * Custom transports to append after the default console and daily-rotate transports.
   */
  additionalTransports?: winston.transport[];
  /**
   * Transports to handle uncaught exceptions.
   */
  exceptionHandlers?: winston.transport[];
  /**
   * Transports to handle unhandled promise rejections.
   */
  rejectionHandlers?: winston.transport[];
  /**
   * Override default JSON log format for file transport.
   */
  jsonLogFormat?: winston.Logform.Format;
  /**
   * Override default human-friendly log format for the console.
   */
  consoleFormat?: winston.Logform.Format;
}
