import * as winston from 'winston';

/**
 * Creates a JSON log format for file or structured logs.
 *
 * - Adds a timestamp (`YYYY-MM-DD HH:mm:ss`) to each log entry.
 * - Includes full error stack traces when available (`{ stack: true }`).
 * - Supports `splat` for string interpolation and metadata expansion.
 * - Outputs as a single JSON object per line (useful for centralized logging).
 *
 * @returns Winston format pipeline for structured JSON logs.
 *
 * @example
 * const jsonFormat = createSharedJsonLogFormat();
 * const logger = winston.createLogger({ format: jsonFormat, ... });
 */
export function createSharedJsonLogFormat(): winston.Logform.Format {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  );
}

/**
 * Information about a log event suitable for console printing.
 *
 * @remarks
 * This includes standard Winston/Nest logger fields as well as contextual data.
 */
type ConsolePrintableInfo = {
  /** ISO or custom-formatted timestamp for the log event. */
  timestamp?: string;
  /** Log level (`info`, `error`, `warn`, etc.) */
  level: string;
  /** Main message content (string or structured data). */
  message: unknown;
  /** Optional NestJS context (e.g., class name or custom scope). */
  context?: string;
  /** Optional stack trace, shown in gray. */
  trace?: string;
  /** Error stack, if present, shown in red. */
  stack?: string;
};

/**
 * Creates a human-readable, colorized console log format aligned with
 * NestJS's typical structure and field naming conventions.
 *
 * - Formats messages as: `[timestamp] [level] [context] message [trace] [stack]`
 * - Uses color for log levels and context labels for readability.
 * - Prints context in cyan, traces in gray, and stacks in red.
 * - Handles both plain string and structured messages.
 *
 * @returns Winston format pipeline for pretty console logging.
 *
 * @example
 * const consoleFormat = createSharedConsoleLogFormat();
 * const logger = winston.createLogger({ format: consoleFormat, ... });
 */
export function createSharedConsoleLogFormat(): winston.Logform.Format {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({
      all: false,
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        verbose: 'cyan',
        debug: 'blue',
      },
    }),
    winston.format.printf((raw) => {
      const info = raw as ConsolePrintableInfo;
      const { timestamp, level, message, context, trace, stack } = info;
      const contextStr = context ? `\x1b[36m[${context}]\x1b[0m` : '';
      const traceStr = trace ? `\n\x1b[90m${trace}\x1b[0m` : '';
      const stackStr = stack ? `\n\x1b[31m${stack}\x1b[0m` : '';
      const msg =
        typeof message === 'string' ? message : JSON.stringify(message);
      return `${timestamp} ${level} ${contextStr} ${msg}${traceStr}${stackStr}`;
    }),
  );
}
