# Logging (Winston configuration)

This package exposes **Winston `LoggerOptions`** (formats, daily-rotate file, console) so your NestJS app can register logging with **`nest-winston`**’s `WinstonModule` yourself—same pattern as a local `winston.config.ts`, but centralized and reusable.

There is **no** `SharedWinstonModule` in this library: you import **`WinstonModule`** from `nest-winston` in **your** `LoggingModule` (or `AppModule`) and pass the shared config.

---

## Table of contents

- [Requirements](#requirements)
- [Install in your project](#install-in-your-project)
- [Recommended pattern (`LoggingModule`)](#recommended-pattern-loggingmodule)
- [Default config constant](#default-config-constant)
- [Async configuration (`ConfigService`)](#async-configuration-configservice)
- [Options reference](#options-reference)
- [Extending the default setup](#extending-the-default-setup)
- [Custom formats only](#custom-formats-only)
- [Environment variables](#environment-variables)
- [Exports](#exports)

---

## Requirements

| Package | Role |
|---------|------|
| `@sisques-labs/shared-nestjs` | `createSharedWinstonLoggerOptions`, formats, merge helper |
| `nest-winston` | `WinstonModule.forRoot` / `forRootAsync` in **your** app |
| `winston` | Peer of both; runtime logger |
| `winston-daily-rotate-file` | Daily file transport (loaded by the factory via `DailyRotateFile`) |

`winston` and `winston-daily-rotate-file` are **optional peers** of this library (install them when you use logging).

---

## Install in your project

```bash
pnpm add @sisques-labs/shared-nestjs nest-winston winston winston-daily-rotate-file
```

---

## Recommended pattern (`LoggingModule`)

**1. Config file** (optional; you can inline the call instead):

```typescript
// winston.config.ts
import { createSharedWinstonLoggerOptions } from '@sisques-labs/shared-nestjs';
import type winston from 'winston';

export const winstonConfig: winston.LoggerOptions =
  createSharedWinstonLoggerOptions({
    service: 'api',
    level: process.env.LOG_LEVEL ?? 'info',
  });
```

**2. Nest module** in your application:

```typescript
// logging.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [WinstonModule],
})
export class LoggingModule {}
```

**3. Register once** (e.g. in `AppModule`):

```typescript
@Module({
  imports: [LoggingModule, /* ... */],
})
export class AppModule {}
```

After that, use Nest’s `Logger` or inject Winston as documented in [nest-winston](https://github.com/gremo/nest-winston).

---

## Default config constant

If you do not need custom options at module load time:

```typescript
import { WinstonModule } from 'nest-winston';
import { defaultSharedWinstonLoggerOptions } from '@sisques-labs/shared-nestjs';

@Module({
  imports: [WinstonModule.forRoot(defaultSharedWinstonLoggerOptions)],
  exports: [WinstonModule],
})
export class LoggingModule {}
```

`defaultSharedWinstonLoggerOptions` is equivalent to `createSharedWinstonLoggerOptions()` with no arguments. For values that depend on `ConfigService`, prefer `forRootAsync` below.

---

## Async configuration (`ConfigService`)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { createSharedWinstonLoggerOptions } from '@sisques-labs/shared-nestjs';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createSharedWinstonLoggerOptions({
          level: config.get<string>('LOG_LEVEL', 'info'),
          service: config.get<string>('SERVICE_NAME', 'api'),
          dailyRotate: {
            filename: config.get<string>('LOG_FILE', 'logs/%DATE%.log'),
          },
        }),
    }),
  ],
  exports: [WinstonModule],
})
export class LoggingModule {}
```

---

## Options reference

See **`SharedWinstonLoggerFactoryOptions`** in `shared-winston-logger-factory-options.interface.ts`. Common fields:

| Field | Description |
|--------|-------------|
| `level` | Winston level (default: `LOG_LEVEL` env or `info`). |
| `service` | Sets `defaultMeta.service` (default `api`). |
| `defaultMeta` | Extra metadata on every log. |
| `enableConsole` / `enableDailyRotateFile` | Toggle default transports. |
| `dailyRotate` | `filename`, `datePattern`, `maxSize`, `maxFiles`, etc. |
| `additionalTransports` | Appended after console + file. |
| `jsonLogFormat` / `consoleFormat` | Replace default pipelines. |

---

## Extending the default setup

```typescript
import {
  createSharedWinstonLoggerOptions,
  mergeSharedWinstonLoggerOptions,
} from '@sisques-labs/shared-nestjs';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const base = createSharedWinstonLoggerOptions({ service: 'billing' });
export const winstonConfig = mergeSharedWinstonLoggerOptions(base, {
  transports: [new winston.transports.Http({ host: 'logs.internal', path: '/ingest', port: 80 })],
});

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [WinstonModule],
})
export class LoggingModule {}
```

`mergeSharedWinstonLoggerOptions` **concatenates** `transports`.

---

## Custom formats only

```typescript
import {
  createSharedJsonLogFormat,
  createSharedConsoleLogFormat,
} from '@sisques-labs/shared-nestjs';
import * as winston from 'winston';

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: createSharedConsoleLogFormat(),
    }),
  ],
};
```

---

## Environment variables

| Variable | Used when |
|----------|-----------|
| `LOG_LEVEL` | Default level if `level` is omitted in `createSharedWinstonLoggerOptions`. |

---

## Exports

| Symbol | Role |
|--------|------|
| `createSharedWinstonLoggerOptions` | Build `winston.LoggerOptions`. |
| `defaultSharedWinstonLoggerOptions` | Same as above with defaults; for `WinstonModule.forRoot(...)`. |
| `mergeSharedWinstonLoggerOptions` | Merge options; concatenate transports. |
| `createSharedJsonLogFormat` | JSON pipeline for files / structured logs. |
| `createSharedConsoleLogFormat` | Colored console pipeline. |
| `SharedWinstonLoggerFactoryOptions` | Options type for the factory. |

---

## Related

- [nest-winston](https://github.com/gremo/nest-winston)
- [Winston](https://github.com/winstonjs/winston)
- [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)
