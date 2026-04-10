# @sisques-labs/shared-nestjs

Shared NestJS library providing **Domain-Driven Design (DDD)** and **CQRS** building blocks, **validated value objects**, **repository abstractions**, optional **MongoDB** and **TypeORM** helpers, **GraphQL** DTOs and plugins, and optional **Winston logger configuration** (for use with `nest-winston` in consuming apps) for microservices and modular monoliths.

## Table of Contents

- [Publishing](#publishing)
  - [CI](#ci)
  - [Release workflow](#release-workflow)
  - [Publish from your machine](#publish-from-your-machine)
- [Installation](#installation)
- [Peer Dependencies](#peer-dependencies)
- [Local development](#local-development)
- [Module Setup](#module-setup)
- [Domain Layer](#domain-layer)
  - [Base Aggregate](#base-aggregate)
  - [Value Objects](#value-objects)
  - [Aggregate and entity IDs](#aggregate-and-entity-ids)
  - [Domain Exceptions](#domain-exceptions)
  - [Criteria & Pagination](#criteria--pagination)
  - [Repository Interfaces](#repository-interfaces)
  - [Factory Interfaces](#factory-interfaces)
  - [View Models](#view-models)
  - [Domain Events](#domain-events)
- [Application Layer](#application-layer)
  - [Command Handlers](#command-handlers)
  - [Service Interface](#service-interface)
- [Infrastructure Layer](#infrastructure-layer)
  - [Logging (Winston)](#logging-winston)
  - [MongoDB](#mongodb)
  - [TypeORM](#typeorm)
- [Transport Layer (GraphQL)](#transport-layer-graphql)
  - [Input DTOs](#input-dtos)
  - [Response DTOs](#response-dtos)
  - [Mappers](#mappers)
  - [Complexity Plugin](#complexity-plugin)
- [Enums](#enums)

---

## Publishing

The package is published to the **public [npm registry](https://www.npmjs.com/)** as `@sisques-labs/shared-nestjs` (see `publishConfig` in `package.json`). Releases are automated with GitHub Actions.

| Workflow | File | Trigger |
|---|---|---|
| **CI** | `.github/workflows/ci.yml` | Push and pull requests targeting `main` |
| **Release** | `.github/workflows/release.yml` | Manual (`workflow_dispatch`) |

### CI

Runs `pnpm install --frozen-lockfile`, **`pnpm lint`** (ESLint with `--fix`), **`pnpm build`**, and **`pnpm test`**.

### Release workflow

Open **GitHub → Actions → Release → Run workflow** and choose:

| Input | Purpose |
|---|---|
| **version** | `patch`, `minor`, or `major` ([SemVer](https://semver.org)) |
| **release_type** | `stable` (default dist-tag) or prerelease **`alpha`** / **`beta`** (separate dist-tags) |

The job then: runs lint and tests, bumps the version with `npm version`, builds, publishes with **`pnpm publish`** using the **`NPM_TOKEN`** repository secret, commits `package.json` / lockfile, creates a git tag, pushes to `main`, and creates a GitHub Release with generated notes.

**Repository setup:** add an [npm automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) with publish rights as the **`NPM_TOKEN`** secret (GitHub → Settings → Secrets and variables → Actions).

### Publish from your machine

```bash
npm login
pnpm build
pnpm publish
```

The `prepublishOnly` script runs **`npm run build`** before publish so `dist/` is current.

---

## Installation

The package is **public** on npm; a normal install is enough:

```bash
pnpm add @sisques-labs/shared-nestjs
# or: npm install / yarn add @sisques-labs/shared-nestjs
```

Use your organization’s registry or mirror policy if applicable.

---

## Peer Dependencies

Install only what your app uses. Peers marked **optional** in `peerDependenciesMeta` can be omitted if you do not import that part of the library.

```bash
# Core NestJS (required for any integration)
pnpm add @nestjs/common @nestjs/core reflect-metadata rxjs

# CQRS (command handlers, EventBus)
pnpm add @nestjs/cqrs

# MongoDB module + repositories in this package
pnpm add mongodb @nestjs/config

# TypeORM module + repositories in this package
pnpm add typeorm @nestjs/typeorm @nestjs/config

# GraphQL DTOs, Apollo, complexity plugin
pnpm add graphql @nestjs/graphql @nestjs/apollo @apollo/server graphql-query-complexity

# class-validator / class-transformer (typical for GraphQL inputs)
pnpm add class-validator class-transformer

# Winston logging (shared config + nest-winston in your app)
pnpm add nest-winston winston winston-daily-rotate-file
```

---

## Local development

For contributors working on this repository:

| Script | Description |
|---|---|
| `pnpm install` | Installs dependencies; **`prepare`** runs Husky and **`pnpm build`**. |
| `pnpm build` | Compiles TypeScript to `dist/` (`nest build`). |
| `pnpm lint` | ESLint with `--fix` on `src`, `apps`, `libs`, `test`. |
| `pnpm lint:check` | ESLint without autofix (used by **Husky pre-commit**). |
| `pnpm test` | Jest unit tests (`*.spec.ts` under `src/`). |
| `pnpm test:cov` | Tests with coverage. |
| `pnpm format` | Prettier on `src` and `test` TypeScript. |

**Git hooks:** [Husky](https://typicode.github.io/husky/) runs **`pnpm lint:check`** and **`pnpm test`** on **pre-commit** (see `.husky/pre-commit`). To skip hooks for a one-off commit: `HUSKY=0 git commit ...`.

---


## Module Setup

Import **`SharedModule`** in your root or core module. It is **`@Global()`**, so exported providers (for example `MongoMasterService`, `TypeormMasterService`, `MutationResponseGraphQLMapper`) are visible across the app without re-importing the module.

```typescript
import { Module } from '@nestjs/common';
import { SharedModule } from '@sisques-labs/shared-nestjs';

@Module({
  imports: [SharedModule],
})
export class AppModule {}
```

`SharedModule` wires **`MongoModule`** and **`TypeOrmModule`**. Configure database connections in **your** application (`MONGO_URI`, `MONGO_DB_NAME`, TypeORM `DataSource`, etc.); this library only provides helpers and services that read that configuration.

**Logging is separate:** this library does **not** register `WinstonModule`. Import **`WinstonModule`** from `nest-winston` in your app and pass **`createSharedWinstonLoggerOptions()`** or **`defaultSharedWinstonLoggerOptions`**—see [Logging (Winston)](#logging-winston).

---

## Domain Layer

### Base Aggregate

`BaseAggregate` extends `@nestjs/cqrs` **`AggregateRoot`** and wires **`createdAt`** and **`updatedAt`** as `DateValueObject` properties. Add identity and domain fields in your subclass (for example a `UuidValueObject` or app-specific id type).

```typescript
import {
  BaseAggregate,
  DateValueObject,
  EmailValueObject,
  UuidValueObject,
} from '@sisques-labs/shared-nestjs';

export class UserAggregate extends BaseAggregate {
  constructor(
    private readonly _id: UuidValueObject,
    private _email: EmailValueObject,
    createdAt: DateValueObject,
    updatedAt: DateValueObject,
  ) {
    super(createdAt, updatedAt);
  }

  get id(): UuidValueObject {
    return this._id;
  }
}
```

Use `apply()`, `commit()`, and related `AggregateRoot` APIs for domain events as usual.

---

### Value Objects

All value objects are immutable and validate their input on construction, throwing a typed domain exception on invalid data.

#### Basic Scalars

| Class | Description |
|---|---|
| `StringValueObject` | String with optional min/max length, pattern, and trim |
| `NumberValueObject` | Numeric value with validation |
| `BooleanValueObject` | Boolean wrapper |
| `DateValueObject` | Date wrapper |
| `JsonValueObject` | Valid JSON value |
| `EnumValueObject<T>` | Typed enum wrapper |

#### Format-Specific

| Class | Description |
|---|---|
| `EmailValueObject` | RFC 5322 compliant. Methods: `getLocalPart()`, `getDomain()` |
| `UuidValueObject` | RFC 4122. Methods: `getVersion()`, `isNil()`, static `generate()` |
| `PhoneValueObject` | E.164 format. Methods: `getCountryCode()`, `toE164()` |
| `UrlValueObject` | Valid URL |
| `IpValueObject` | IPv4/IPv6 validation |
| `HexValueObject` | Hexadecimal string |
| `ColorValueObject` | Hex, RGB, HSL, and named colors with conversion methods |
| `SlugValueObject` | URL-friendly slug. Methods: `toHumanReadable()`, `addPrefix()`, `addSuffix()`, static `generateSlug()` |
| `PasswordValueObject` | Strength scoring, common password detection. Methods: `getStrengthScore()`, `meetsRequirements()` |
| `LocaleValueObject` | BCP 47 locale (50+ supported). Methods: `getLanguageCode()`, `getCountryCode()`, `getDisplayName()` |
| `TimezoneValueObject` | IANA timezone |
| `PhoneCodeValueObject` | Phone dial code |
| `LengthUnitValueObject` | Unit of length measurement |
| `DimensionsValueObject` | Length, width, height with unit and optional bounds |
| `NumericRangeValueObject` | Min/max numeric range |

**Usage example:**

```typescript
import {
  EmailValueObject,
  UuidValueObject,
  PasswordValueObject,
} from '@sisques-labs/shared-nestjs';

const email = new EmailValueObject('user@example.com');
console.log(email.getDomain()); // 'example.com'

const id = UuidValueObject.generate();
console.log(id.getVersion()); // 4

const password = new PasswordValueObject('MyS3cur3P@ss!');
console.log(password.getStrengthScore()); // number 0-5
console.log(password.meetsRequirements()); // boolean
```

Many value objects also have a **folder-level `README.md`** under `src/shared/domain/value-objects/<name>/` with API tables and examples.

---

### Aggregate and entity IDs

The library exports **`UuidValueObject`** for validated RFC 4122 UUID strings (construction, `generate()`, `getVersion()`, `isNil()`, etc.).

For **aggregate- or entity-specific** identifiers (nominal typing per bounded context), define thin subclasses or wrappers **in your application**, for example:

```typescript
import { UuidValueObject } from '@sisques-labs/shared-nestjs';

export class UserId extends UuidValueObject {
  // optional: narrow type or factory methods for your domain
}
```

---

### Domain Exceptions

`BaseException` is the root exception class. Each value object has a corresponding typed exception thrown on validation failure.

```typescript
import { BaseException } from '@sisques-labs/shared-nestjs';

// BaseException provides:
// - timestamp: Date
// - getDetailedMessage(): string  → "[ClassName]: message"
// - toJSON(): object
```

Available typed exceptions (all extend `BaseException`):

`InvalidBooleanException`, `InvalidColorException`, `InvalidDimensionsException`, `InvalidEmailException`, `InvalidEnumValueException`, `InvalidHexException`, `InvalidIpException`, `InvalidJsonException`, `InvalidLocaleException`, `InvalidNumberException`, `InvalidNumericRangeException`, `InvalidPasswordException`, `InvalidPhoneException`, `InvalidStringException`, `InvalidTimezoneException`, `InvalidUrlException`, `InvalidUuidException`

---

### Criteria & Pagination

Use `Criteria` to build type-safe query parameters with filters, sorts, and pagination.

```typescript
import {
  Criteria,
  FilterOperator,
  SortDirection,
} from '@sisques-labs/shared-nestjs';

const criteria = new Criteria(
  [{ field: 'email', operator: FilterOperator.EQUALS, value: 'user@example.com' }],
  [{ field: 'createdAt', direction: SortDirection.DESC }],
  { page: 1, perPage: 20 },
);
```

`PaginatedResult<T>` wraps paginated query results:

```typescript
import { PaginatedResult } from '@sisques-labs/shared-nestjs';

// { data: T[], total: number, page: number, perPage: number }
const result: PaginatedResult<User> = await repository.findByCriteria(criteria);
```

---

### Repository Interfaces

Implement these interfaces in your infrastructure layer to keep the domain free of database concerns.

```typescript
import {
  IBaseReadRepository,
  IBaseWriteRepository,
} from '@sisques-labs/shared-nestjs';

// Read side: findById, findByCriteria, save, delete
interface IUserReadRepository extends IBaseReadRepository<UserAggregate> {}

// Write side: findById, save, delete
interface IUserWriteRepository extends IBaseWriteRepository<UserAggregate> {}
```

---

### Factory Interfaces

Factories handle deserialization of aggregates from different sources.

```typescript
import { IReadFactory, IWriteFactory } from '@sisques-labs/shared-nestjs';

// Read factory: creates view models from aggregates, DTOs, or primitives
class UserReadFactory implements IReadFactory<UserViewModel, UserAggregate, UserDto> {
  create(data: UserDto): UserViewModel { ... }
  fromAggregate(aggregate: UserAggregate): UserViewModel { ... }
  fromPrimitives(primitives: object): UserViewModel { ... }
}

// Write factory: creates aggregates from commands or primitives
class UserWriteFactory implements IWriteFactory<UserAggregate, CreateUserCommand, UserPrimitives> {
  create(command: CreateUserCommand): UserAggregate { ... }
  fromPrimitives(primitives: UserPrimitives): UserAggregate { ... }
}
```

---

### View Models

`BaseViewModel` provides a base for read-side projections with typed accessors for `id`, `createdAt`, and `updatedAt`.

```typescript
import { BaseViewModel } from '@sisques-labs/shared-nestjs';

export class UserViewModel extends BaseViewModel {
  // Inherited: getId(), getCreatedAt(), getUpdatedAt()
}
```

---

### Domain Events

`IBaseEventData` and `IEventMetadata` provide a structured shape for domain events with aggregate and entity metadata.

```typescript
import { IBaseEventData, IEventMetadata } from '@sisques-labs/shared-nestjs';

// IEventMetadata shape:
// {
//   aggregateRootId: string;
//   aggregateRootType: string;
//   entityId: string;
//   entityType: string;
//   eventType: string;
// }
```

---

## Application Layer

### Command Handlers

`BaseCommandHandler` integrates the `EventBus` to publish domain events automatically after command execution.

```typescript
import { BaseCommandHandler } from '@sisques-labs/shared-nestjs';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends BaseCommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: IUserWriteRepository,
    eventBus: EventBus,
  ) {
    super(eventBus);
  }

  async execute(command: CreateUserCommand): Promise<void> {
    const user = UserWriteFactory.create(command);
    await this.repository.save(user);
    this.publishEvents(user); // publishes domain events from the aggregate
  }
}
```

`BaseUpdateCommandHandler` adds utilities to extract changed fields from update commands, useful for partial updates.

---

### Service Interface

`IBaseService` is a marker interface for application services.

```typescript
import { IBaseService } from '@sisques-labs/shared-nestjs';

@Injectable()
export class UserService implements IBaseService {}
```

---

## Infrastructure Layer

### Logging (Winston)

Optional **Winston `LoggerOptions`** (JSON file rotation + console formats) for use with **`WinstonModule.forRoot`** from **`nest-winston`** in the consuming app. Install `nest-winston`, `winston`, and `winston-daily-rotate-file` there; this package lists `winston` and `winston-daily-rotate-file` as optional peers.

**Main exports:** `createSharedWinstonLoggerOptions`, `defaultSharedWinstonLoggerOptions`, `mergeSharedWinstonLoggerOptions`, `createSharedJsonLogFormat`, `createSharedConsoleLogFormat`, and `SharedWinstonLoggerFactoryOptions`.

**Full guide:** [src/shared/infrastructure/logging/README.md](src/shared/infrastructure/logging/README.md)

---

### MongoDB

#### Environment Variables

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=my_database
```

#### Base Repository

Extend `BaseMongoMasterRepository` to get filter, sort, and pagination support out of the box.

```typescript
import {
  BaseMongoMasterRepository,
  MongoMasterService,
  Criteria,
  PaginatedResult,
} from '@sisques-labs/shared-nestjs';

@Injectable()
export class UserMongoRepository extends BaseMongoMasterRepository<UserMongoDto> {
  constructor(mongoService: MongoMasterService) {
    super(mongoService, 'users'); // collection name
  }

  async findByCriteria(criteria: Criteria): Promise<PaginatedResult<UserAggregate>> {
    return this.executeQueryWithPagination(criteria);
    // Automatically maps FilterOperator → MongoDB $operators
    // Applies sorts and pagination (skip/limit)
  }
}
```

`FilterOperator` → MongoDB operator mapping:

| Enum value | MongoDB operator |
|---|---|
| `EQUALS` | `$eq` |
| `NOT_EQUALS` | `$ne` |
| `LIKE` | `$regex` |
| `IN` | `$in` |
| `GT` | `$gt` |
| `LT` | `$lt` |
| `GTE` | `$gte` |
| `LTE` | `$lte` |

#### Base DTO

```typescript
import { BaseMongoDto } from '@sisques-labs/shared-nestjs';

// Type: { id: string; createdAt: Date; updatedAt: Date }
type UserMongoDto = BaseMongoDto & {
  email: string;
  name: string;
};
```

---

### TypeORM

#### Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secret
DB_DATABASE=my_database
```

#### Base Entity

```typescript
import { BaseTypeormEntity } from '@sisques-labs/shared-nestjs';
import { Entity, Column } from 'typeorm';

@Entity('users')
export class UserTypeormEntity extends BaseTypeormEntity {
  // Inherited: id (UUID, primary key), createdAt, updatedAt, deletedAt (soft delete)

  @Column()
  email: string;
}
```

#### Base Repository

```typescript
import {
  BaseTypeormMasterRepository,
  TypeormMasterService,
} from '@sisques-labs/shared-nestjs';

@Injectable()
export class UserTypeormRepository extends BaseTypeormMasterRepository {
  constructor(typeormService: TypeormMasterService) {
    super(typeormService);
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const repo = this.getRepository(UserTypeormEntity);
    const entity = await repo.findOneBy({ id });
    return entity ? UserWriteFactory.fromPrimitives(entity) : null;
  }
}
```

#### Base DTO

```typescript
import { BaseTypeormDto } from '@sisques-labs/shared-nestjs';

// Type: { id: string; createdAt: Date; updatedAt: Date }
type UserTypeormDto = BaseTypeormDto & {
  email: string;
};
```

---

## Transport Layer (GraphQL)

### Input DTOs

#### `BaseFindByCriteriaInput`

Composite input for list queries combining filters, sorts, and pagination.

```graphql
query {
  users(
    criteria: {
      filters: [{ field: "email", operator: EQUALS, value: "user@example.com" }]
      sorts: [{ field: "createdAt", direction: DESC }]
      pagination: { page: 1, perPage: 20 }
    }
  ) {
    total
    page
    perPage
    totalPages
    data { id email }
  }
}
```

```typescript
import { BaseFindByCriteriaInput } from '@sisques-labs/shared-nestjs';

@Resolver()
export class UserResolver {
  @Query(() => UsersPaginatedResult)
  users(@Args('criteria') criteria: BaseFindByCriteriaInput) {
    return this.userService.findByCriteria(criteria);
  }
}
```

Individual input types: `BaseFilterInput`, `BaseSortInput`, `BasePaginationInput`, `NumericRangeInput`.

---

### Response DTOs

#### `BasePaginatedResultDto`

```typescript
import { BasePaginatedResultDto } from '@sisques-labs/shared-nestjs';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UsersPaginatedResult extends BasePaginatedResultDto {
  @Field(() => [UserDto])
  data: UserDto[];
  // Inherited: total, page, perPage, totalPages (computed automatically)
}
```

#### `MutationResponseDto`

```typescript
import { MutationResponseDto } from '@sisques-labs/shared-nestjs';

// Shape: { success: boolean; message?: string; id?: string }

@Mutation(() => MutationResponseDto)
createUser(@Args('input') input: CreateUserInput): Promise<MutationResponseDto> { ... }
```

#### `MutationResponseArrayDto`

```typescript
import { MutationResponseArrayDto } from '@sisques-labs/shared-nestjs';

// Shape: { success: boolean; message?: string; ids: string[] }

@Mutation(() => MutationResponseArrayDto)
deleteUsers(@Args('ids', { type: () => [String] }) ids: string[]): Promise<MutationResponseArrayDto> { ... }
```

---

### Mappers

`MutationResponseGraphQLMapper` is a NestJS injectable service provided by `SharedModule` that maps domain results to `MutationResponseDto`.

```typescript
import { MutationResponseGraphQLMapper } from '@sisques-labs/shared-nestjs';

@Resolver()
export class UserResolver {
  constructor(private readonly mutationMapper: MutationResponseGraphQLMapper) {}

  @Mutation(() => MutationResponseDto)
  async createUser(@Args('input') input: CreateUserInput) {
    const result = await this.commandBus.execute(new CreateUserCommand(input));
    return this.mutationMapper.map(result);
  }
}
```

---

### Complexity Plugin

`ComplexityPlugin` is an **Apollo Server plugin** (`@Plugin()` from `@nestjs/apollo`) that rejects operations whose estimated complexity exceeds **1000** (see `graphql-query-complexity`). It is **exported** from this package but **not** registered inside `SharedModule`—add it to your GraphQL module’s **`providers`** (or equivalent) so Nest discovers the plugin.

To assign complexity weights to fields use the `@Complexity` decorator from `@nestjs/graphql`:

```typescript
import { Field, ObjectType, Complexity } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field()
  @Complexity(1)
  id: string;
}
```

Register the plugin (for example next to your GraphQL module):

```typescript
import { Module } from '@nestjs/common';
import { ComplexityPlugin } from '@sisques-labs/shared-nestjs';

@Module({
  providers: [ComplexityPlugin],
})
export class GraphqlPluginsModule {}
```

---

## Enums

```typescript
import {
  FilterOperator,
  SortDirection,
  LengthUnitEnum,
  UserRoleEnum,
  UserStatusEnum,
} from '@sisques-labs/shared-nestjs';

FilterOperator.EQUALS     // 'eq'
FilterOperator.NOT_EQUALS // 'ne'
FilterOperator.LIKE       // 'like'
FilterOperator.IN         // 'in'
FilterOperator.GT         // 'gt'
FilterOperator.LT         // 'lt'
FilterOperator.GTE        // 'gte'
FilterOperator.LTE        // 'lte'

SortDirection.ASC
SortDirection.DESC
```

---

## License

MIT — [Sisques Labs](https://github.com/JSisques)
