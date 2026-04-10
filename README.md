# @sisques-labs/shared-nestjs

Shared NestJS library providing Domain-Driven Design (DDD) and CQRS building blocks, validated value objects, repository abstractions, and GraphQL utilities for use across microservices and modular monolith projects.

## Table of Contents

- [Publishing](#publishing)
  - [Setup](#setup)
  - [Releasing a new version](#releasing-a-new-version)
- [Installation](#installation)
- [Peer Dependencies](#peer-dependencies)
- [Module Setup](#module-setup)
- [Domain Layer](#domain-layer)
  - [Base Aggregate](#base-aggregate)
  - [Value Objects](#value-objects)
  - [Domain Identifiers](#domain-identifiers)
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

This package is published to **GitHub Packages** under the `@sisques-labs` scope and managed via two GitHub Actions workflows.

| Workflow | File | Trigger |
|---|---|---|
| **CI** | `.github/workflows/ci.yml` | Every push to `main` and every PR |
| **Release** | `.github/workflows/release.yml` | Manual (`workflow_dispatch`) |

### CI Workflow

Runs automatically on every push to `main` and on every pull request. Executes lint, build, and tests to ensure the codebase is always healthy.

### Release Workflow

Triggered manually from **GitHub → Actions → Release → Run workflow**.

Steps it performs automatically:
1. Lint + test (as a safety gate)
2. Bump `package.json` version (`patch`, `minor`, or `major`)
3. Build (`dist/`)
4. Publish to GitHub Packages
5. Commit the version bump, create a git tag, and push to `main`
6. Create a GitHub Release with auto-generated release notes

The only input required is the version type:

```
patch  →  0.0.1 → 0.0.2   (bug fixes)
minor  →  0.0.1 → 0.1.0   (new features, backwards compatible)
major  →  0.0.1 → 1.0.0   (breaking changes)
```

No manual `pnpm version` or `pnpm publish` needed — the workflow handles everything.

### First-time Setup (local publishing only)

> The release workflow uses the built-in `GITHUB_TOKEN` automatically — no secrets configuration needed in GitHub. This section is only needed to publish from your local machine.

**1. Create a GitHub Personal Access Token**

Go to: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

Required scopes:
- `write:packages` — to publish
- `read:packages` — to install in other projects

**2. Export the token as an environment variable**

The `.npmrc` in this repo reads the token from `NODE_AUTH_TOKEN`:

```bash
export NODE_AUTH_TOKEN=YOUR_GITHUB_TOKEN
```

Add this to your shell profile (`~/.zshrc` or `~/.bashrc`) to make it permanent.

**3. Publish**

```bash
pnpm publish
```

The `prepublishOnly` script runs `pnpm build` automatically before publishing, so `dist/` is always up to date.

---

### Releasing a new version

Follow [Semantic Versioning](https://semver.org):

```bash
pnpm version patch   # bug fixes:        0.0.1 → 0.0.2
pnpm version minor   # new features:     0.0.1 → 0.1.0
pnpm version major   # breaking changes: 0.0.1 → 1.0.0
```

This updates `package.json` and creates a git tag automatically. Then publish:

```bash
pnpm publish
```

---

## Installation

This package is hosted on GitHub Packages. Before installing, configure your project to resolve the `@sisques-labs` scope from the GitHub registry.

**1. Add a `.npmrc` file to the root of your project:**

```
@sisques-labs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set the `GITHUB_TOKEN` environment variable to a GitHub Personal Access Token with at least `read:packages` scope (see [Publishing → Setup](#setup)).

**2. Install the package:**

```bash
npm install @sisques-labs/shared-nestjs
# or
pnpm add @sisques-labs/shared-nestjs
# or
yarn add @sisques-labs/shared-nestjs
```

---

## Peer Dependencies

Install the peer dependencies for the features you need. All database and GraphQL dependencies are optional.

```bash
# Core NestJS (always required)
npm install @nestjs/common @nestjs/core reflect-metadata rxjs

# CQRS support
npm install @nestjs/cqrs

# MongoDB support
npm install mongodb @nestjs/config

# TypeORM support
npm install typeorm @nestjs/typeorm @nestjs/config

# GraphQL support
npm install graphql @nestjs/graphql @nestjs/apollo @apollo/server graphql-query-complexity

# Validation (required for GraphQL DTOs)
npm install class-validator class-transformer
```

---

## Module Setup

Import `SharedModule` into your application module. It is a global module, so its providers (MongoDB and TypeORM services, mappers) are available throughout the application without re-importing.

```typescript
import { Module } from '@nestjs/common';
import { SharedModule } from '@sisques-labs/shared-nestjs';

@Module({
  imports: [SharedModule],
})
export class AppModule {}
```

`SharedModule` automatically initializes both `MongoModule` and `TypeOrmModule`. Configure them via environment variables or `@nestjs/config` in your app.

---

## Domain Layer

### Base Aggregate

`BaseAggregate` extends NestJS's `AggregateRoot` and provides `createdAt` and `updatedAt` value objects out of the box. All domain aggregates should extend it.

```typescript
import { BaseAggregate } from '@sisques-labs/shared-nestjs';

export class UserAggregate extends BaseAggregate {
  private _email: EmailValueObject;

  constructor(
    id: UserUuidValueObject,
    email: EmailValueObject,
    createdAt: DateValueObject,
    updatedAt: DateValueObject,
  ) {
    super(id, createdAt, updatedAt);
    this._email = email;
  }
}
```

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
| `DimensionsValueObject` | Width/height dimensions |
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

---

### Domain Identifiers

Typed UUID wrappers for each aggregate root, all extending `UuidValueObject`.

| Class | Aggregate |
|---|---|
| `UserUuidValueObject` | User |
| `AuthUuidValueObject` | Auth |
| `PlantUuidValueObject` | Plant |
| `PlantSpeciesUuidValueObject` | Plant Species |
| `GrowingUnitUuidValueObject` | Growing Unit |
| `LocationUuidValueObject` | Location |
| `OverviewUuidValueObject` | Overview |
| `SagaInstanceUuidValueObject` | Saga Instance |
| `SagaStepUuidValueObject` | Saga Step |
| `SagaLogUuidValueObject` | Saga Log |

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

Optional **structured logging** via Winston, daily log rotation, and `nest-winston`. Install peers `nest-winston`, `winston`, and `winston-daily-rotate-file` in the consuming app, then use `SharedWinstonModule` and helpers such as `createSharedWinstonLoggerOptions`.

**Full guide (setup, async config, extension patterns):** [src/shared/infrastructure/logging/README.md](src/shared/infrastructure/logging/README.md)

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

`ComplexityPlugin` is an Apollo server plugin provided automatically by `SharedModule`. It validates query complexity on every request and rejects queries exceeding **1000 points**.

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
