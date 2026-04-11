# MongoDB services

This folder contains **Nest injectables** that own **MongoDB client lifecycle** (connect on startup, close on shutdown) and expose **`Db` / `Collection`** accessors for the infrastructure layer.

Implementation: **`mongo.service.ts`** → **`MongoService`**.

---

## Role in the application

| Concern | Where it lives |
|--------|----------------|
| **Registering the service in DI** | **`MongoModule`** (parent **`mongodb/`** folder) registers **`MongoService`** as a **`@Global()`** provider. |
| **Using the connection** | Repositories extend **`BaseMongoDatabaseRepository`**, which receives **`MongoService`** and calls **`getCollection`**. |
| **Direct use** | Any **`@Injectable()`** may inject **`MongoService`** for **`getDatabase()`** / **`getCollection()`** without using the repository base. |

---

## What you must do in another project

1. **`pnpm add @sisques-labs/nestjs-kit mongodb @nestjs/config`** (and other Nest peers as needed).
2. **`ConfigModule.forRoot`** (global or imported before **`MongoModule`**) so **`MONGODB_URI`** and **`MONGODB_DATABASE`** are available to **`ConfigService`**.
3. **`MongoModule`** in **`imports`** of **`AppModule`** (or equivalent root module).

You do **not** list **`MongoService`** under **`providers`** yourself unless you are **overriding** or **mocking** it in a test module.

---

## `MongoService` (detailed)

### Behaviour

- Connects a **`MongoClient`** in **`onModuleInit`** using **`ConfigService`** (`MONGODB_URI`, `MONGODB_DATABASE`).
- Holds the default **`Db`** for your application database name.
- Exposes **`getDatabase()`** and **`getCollection(collectionName)`**.
- Closes the client in **`onModuleDestroy`**.

### Prerequisites

**`MongoService`** depends on **`ConfigService`**. Example root setup:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@sisques-labs/nestjs-kit';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
  ],
})
export class AppModule {}
```

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| **`MONGODB_URI`** | Yes | Connection string for **`MongoClient`**. |
| **`MONGODB_DATABASE`** | Yes | Database name for **`client.db(dbName)`**. |

### Public API

```typescript
getDatabase(): Db;
getCollection(collectionName: string): Collection;
```

### Consumption patterns

**A. Through `BaseMongoDatabaseRepository` (recommended)**  
Subclass the base, `constructor(mongo: MongoService) { super(mongo); }`, use **`this.getCollection('name')`**.

**B. Direct injection**

```typescript
import { Injectable } from '@nestjs/common';
import { MongoService } from '@sisques-labs/nestjs-kit';

@Injectable()
export class CustomMongoAccess {
  constructor(private readonly mongo: MongoService) {}

  async ping() {
    const col = this.mongo.getCollection('events');
    return col.estimatedDocumentCount();
  }
}
```

Register **`CustomMongoAccess`** in a module’s **`providers`**; **`MongoService`** resolves from the global scope provided by **`MongoModule`**.

### Module checklist

| Step | Done when |
|------|-----------|
| **`ConfigModule.forRoot`** supplies **`ConfigService`** | Env visible to **`MongoService`**. |
| **`MongoModule`** in **`imports`** | **`MongoService`** registered globally. |
| Feature module lists your repositories | Nest injects **`MongoService`** into their constructors. |

Put **`ConfigModule`** before **`MongoModule`** in **`imports`** where possible.

### Testing

```typescript
const mockMongo = {
  getCollection: jest.fn().mockReturnValue(mockCollection),
  getDatabase: jest.fn(),
};

await Test.createTestingModule({
  providers: [
    { provide: MongoService, useValue: mockMongo },
    UserMongoReadRepository,
  ],
}).compile();
```

See **`mongo.service.spec.ts`** in this folder for unit tests.

### Operational notes

- **Single client** per process; typical for one service instance.
- **`authSource: 'admin'`** is set on **`MongoClient`** in the current implementation.
- **`onModuleDestroy`** closes the client on app shutdown.

---

## Adding more services later

If the kit gains another client (e.g. read replica), add **`services/<name>.service.ts`**, document it here, and extend **`MongoModule`** (or add a dedicated module).
