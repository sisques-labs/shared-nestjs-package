# Logging (Winston + nest-winston)

This package ships a **ready-to-use Winston setup** for NestJS applications: JSON logs to **daily-rotating files**, a **colored console** formatter aligned with Nest’s `context` / `trace` / `stack` fields, and a thin **`SharedWinstonModule`** wrapper around [`nest-winston`](https://github.com/gremo/nest-winston).

---

## Table of contents

- [Requirements](#requirements)
- [Install in your project](#install-in-your-project)
- [Quick start](#quick-start)
- [Use Nest’s `Logger`](#use-nests-logger)
- [Async configuration with `ConfigService`](#async-configuration-with-configservice)
- [Options reference](#options-reference)
- [Extending the default setup](#extending-the-default-setup)
- [Custom formats only](#custom-formats-only)
- [Environment variables](#environment-variables)

---

## Requirements

These packages are **optional peers** of `@sisques-labs/shared-nestjs`. When you use logging, install them in the **host application** (versions should satisfy the peer range declared in this library’s `package.json`):

- `nest-winston`
- `winston`
- `winston-daily-rotate-file`

---

## Install in your project

```bash
pnpm add @sisques-labs/shared-nestjs nest-winston winston winston-daily-rotate-file
# or: npm install / yarn add
```

Ensure your app’s `AppModule` (or a dedicated `LoggingModule`) imports `SharedWinstonModule` **once**, typically near the top of `imports`, before other modules that rely on logging.

---

## Quick start

Wrap the shared module and re-export `WinstonModule` so the rest of the app can stay unchanged.

```typescript
import { Module } from '@nestjs/common';
import { SharedWinstonModule } from '@sisques-labs/shared-nestjs';

@Module({
  imports: [
    SharedWinstonModule.forRoot({
      service: 'api',
      level: process.env.LOG_LEVEL ?? 'info',
    }),
  ],
  exports: [SharedWinstonModule],
})
export class LoggingModule {}
```

Register it from `AppModule`:

```typescript
@Module({
  imports: [LoggingModule, /* ... */],
})
export class AppModule {}
```

**Default behaviour**

- **Console**: timestamp, level colors, `[context]` in cyan, trace/stack styling similar to a typical Nest + Winston setup.
- **File**: `winston-daily-rotate-file` writing under `logs/%DATE%.log` (pattern `YYYY-MM-DD`), gzip archives, `20m` max size, `14d` retention, **JSON** lines using the shared JSON pipeline.

Create the `logs/` directory or point `dailyRotate.filename` to a path your process can write to.

---

## Use Nest’s `Logger`

After `WinstonModule` is registered via `SharedWinstonModule`, inject Nest’s logger as usual:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  findAll() {
    this.logger.log('Listing users');
    return [];
  }
}
```

To use Winston as the **application logger** (e.g. bootstrap logs), pass options into `NestFactory.create` (see [NestJS logger docs](https://docs.nestjs.com/techniques/logger)) using `WinstonModule.createLogger` from `nest-winston` together with `createSharedWinstonLoggerOptions` if you want the same config.

---

## Async configuration with `ConfigService`

Use `forRootAsync` when levels, paths, or service names come from configuration:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedWinstonModule } from '@sisques-labs/shared-nestjs';

@Module({
  imports: [
    SharedWinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        level: config.get<string>('LOG_LEVEL', 'info'),
        service: config.get<string>('SERVICE_NAME', 'api'),
        dailyRotate: {
          filename: config.get<string>('LOG_FILE', 'logs/%DATE%.log'),
          maxFiles: config.get<string>('LOG_MAX_FILES', '14d'),
        },
      }),
    }),
  ],
  exports: [SharedWinstonModule],
})
export class LoggingModule {}
```

The factory return type is **`SharedWinstonLoggerFactoryOptions`**; it is passed to `createSharedWinstonLoggerOptions` internally.

---

## Options reference

`SharedWinstonLoggerFactoryOptions` (all optional except where noted):

| Field | Description |
|--------|-------------|
| `level` | Winston level. Default: `process.env.LOG_LEVEL` or `'info'`. |
| `service` | Shorthand for `defaultMeta.service`. Default `'api'` when no `defaultMeta` is provided. |
| `defaultMeta` | Extra fields merged into every log line. |
| `enableConsole` | Set `false` to disable the console transport. Default `true`. |
| `enableDailyRotateFile` | Set `false` to disable the rotating file transport. Default `true`. |
| `dailyRotate` | Overrides for `filename`, `datePattern`, `zippedArchive`, `maxSize`, `maxFiles`, and `format`. |
| `additionalTransports` | Extra `winston.transport` instances **after** the default console and file transports. |
| `exceptionHandlers` / `rejectionHandlers` | Passed through to Winston (default empty arrays). |
| `jsonLogFormat` | Replace the default JSON pipeline used for the file transport (and root `format`). |
| `consoleFormat` | Replace the default console pipeline. |

For the full TypeScript shape, see `shared-winston-logger-factory-options.interface.ts`.

---

## Extending the default setup

### Merge extra transports

Use **`mergeSharedWinstonLoggerOptions`** when you already have a base config from **`createSharedWinstonLoggerOptions`** and want to append transports or tweak fields. **Transports are concatenated**, not replaced.

```typescript
import {
  createSharedWinstonLoggerOptions,
  mergeSharedWinstonLoggerOptions,
} from '@sisques-labs/shared-nestjs';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const base = createSharedWinstonLoggerOptions({ service: 'billing' });

export const winstonModuleOptions = mergeSharedWinstonLoggerOptions(base, {
  transports: [
    new winston.transports.Http({
      host: 'log.example.com',
      port: 80,
      path: '/collect',
    }),
  ],
});

// Then either:
@Module({
  imports: [WinstonModule.forRoot(winstonModuleOptions)],
  exports: [WinstonModule],
})
export class LoggingModule {}
```

### Extra transports via options only

```typescript
SharedWinstonModule.forRoot({
  service: 'api',
  additionalTransports: [new winston.transports.Stream({ stream: process.stderr })],
});
```

---

## Custom formats only

If you only want the **format stacks** (e.g. you build `LoggerOptions` yourself):

```typescript
import {
  createSharedJsonLogFormat,
  createSharedConsoleLogFormat,
} from '@sisques-labs/shared-nestjs';
import * as winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: createSharedConsoleLogFormat(),
    }),
  ],
});
```

---

## Environment variables

| Variable | Used by |
|----------|---------|
| `LOG_LEVEL` | Default log level when `level` is omitted in options. |

You can read any other variables in `forRootAsync` / `ConfigService` and map them to `SharedWinstonLoggerFactoryOptions`.

---

## Exported symbols

| Export | Role |
|--------|------|
| `SharedWinstonModule` | `forRoot` / `forRootAsync` around `WinstonModule`. |
| `createSharedWinstonLoggerOptions` | Builds `winston.LoggerOptions`. |
| `mergeSharedWinstonLoggerOptions` | Merges options; **concatenates** `transports`. |
| `createSharedJsonLogFormat` | JSON file-oriented pipeline. |
| `createSharedConsoleLogFormat` | Colored console pipeline. |
| `SharedWinstonLoggerFactoryOptions` | Options type for the factory. |
| `SharedWinstonModuleAsyncOptions` | Async module registration type. |

---

## Related reading

- [nest-winston](https://github.com/gremo/nest-winston)
- [Winston transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md)
- [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)
