# MongoDB infrastructure (kit)

This area provides **opt-in** NestJS wiring for a **single MongoDB connection**, a **global `MongoService`**, a **repository base class** with criteria helpers, **DTO typing** for documents, and **mappers** between persistence shapes and domain types.

Nothing here is loaded unless your application imports **`MongoModule`** from `@sisques-labs/nestjs-kit`.

---

## Layout

| Folder / file | Purpose |
|---------------|---------|
| **`mongodb.module.ts`** | Registers and exports **`MongoService`** as a **`@Global()`** provider. |
| **`services/`** | **`MongoService`** — connection lifecycle. See [services/README.md](./services/README.md). |
| **`base-mongo/`** | **`BaseMongoDatabaseRepository`** — extend for read/write repositories. See [base-mongo/README.md](./base-mongo/README.md). |
| **`dtos/`** | Shared document shape types (e.g. **`BaseMongoDto`**). See [dtos/README.md](./dtos/README.md). |
| **`mappers/`** | **`BaseMongoDBMapper`** and mapping patterns. See [mappers/README.md](./mappers/README.md). |

---

## Quick start in a consuming app

1. **Dependencies** (peer / app): `mongodb`, `@nestjs/config`, `@nestjs/common`, `@nestjs/core`.

2. **Environment** (read by **`MongoService`**):

   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=my_app
   ```

3. **Root module** — load config first so **`ConfigService`** exists when **`MongoService`** initializes:

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

4. **Feature module** — register your repositories and mappers; inject **`MongoService`** only if you do not extend **`BaseMongoDatabaseRepository`** (the base already receives it):

   ```typescript
   @Module({
     providers: [UserMongoReadRepository, UserMongoDBMapper],
     exports: [UserMongoReadRepository],
   })
   export class UserInfrastructureModule {}
   ```

5. **Repositories** — `extends BaseMongoDatabaseRepository`, `constructor(mongo: MongoService) { super(mongo); }`, then use **`this.getCollection('collectionName')`** and the protected query helpers.

---

## Design notes

- **`MongoModule` is `@Global()`** so **`MongoService`** is available in any module after a single import of **`MongoModule`** in **`AppModule`** (or another root import graph).
- The kit does **not** auto-register your feature repositories; you add them to **`providers`** where they belong (usually an infrastructure or persistence module per bounded context).
- For **tests**, replace **`MongoService`** with **`useValue` / `useFactory`** mocks (see **`services/mongo.service.spec.ts`** and **`base-mongo/base-mongo-database.repository.spec.ts`** in this repo).

---

## Further reading

- [services/README.md](./services/README.md) — **`MongoService`** overview, API, modules, and testing.
