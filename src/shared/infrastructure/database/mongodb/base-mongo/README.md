# `base-mongo` — repository base

This folder contains **`BaseMongoDatabaseRepository`**, an abstract class for MongoDB-backed repositories that share **`MongoService`**, **`getCollection`**, and **criteria → query** helpers.

---

## What it provides

| API | Visibility | Description |
|-----|------------|-------------|
| **`mongoService`** | `protected` | Injected **`MongoService`** (Nest DI singleton). |
| **`getCollection(name)`** | `protected` | Returns a driver **`Collection`** for the given name. |
| **`buildMongoQuery(criteria)`** | `protected` | Maps domain **`Criteria`** filters to a Mongo filter object. |
| **`buildSortQuery(criteria)`** | `protected` | Maps sorts to a Mongo sort object (default sort when empty). |
| **`executeQueryWithPagination(...)`** | `protected` | Runs **`find` + `sort` + `skip` + `limit`** and **`countDocuments`** in parallel. |
| **`calculatePagination(criteria)`** | `protected` (inherited) | From **`BaseDatabaseRepository`** — `page`, `limit`, `skip`. |
| **`logger`** | `protected` | Nest **`Logger`** named after the concrete class. |

---

## How to extend

1. Subclass **`BaseMongoDatabaseRepository`**.
2. Inject **`MongoService`** in your constructor and call **`super(mongo)`**.
3. Implement your repository methods using **`this.getCollection('yourCollection')`** and the helpers above.

```typescript
import { Injectable } from '@nestjs/common';
import {
  BaseMongoDatabaseRepository,
  MongoService,
  Criteria,
  PaginatedResult,
} from '@sisques-labs/nestjs-kit';

@Injectable()
export class UserMongoReadRepository extends BaseMongoDatabaseRepository {
  private static readonly COLLECTION = 'users';

  constructor(mongo: MongoService) {
    super(mongo);
  }

  async findByCriteria(criteria: Criteria): Promise<PaginatedResult<UserViewModel>> {
    const collection = this.getCollection(UserMongoReadRepository.COLLECTION);
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);
    const { skip, limit } = await this.calculatePagination(criteria);
    const [rows, total] = await this.executeQueryWithPagination(
      collection,
      mongoQuery,
      sortQuery,
      skip,
      limit,
    );
    // Map documents to view models and return PaginatedResult
  }
}
```

---

## Module registration

- Register each concrete repository in a Nest **`providers`** array.
- Import **`MongoModule`** once at application root so **`MongoService`** exists when the repository is constructed.

---

## Tests

See **`base-mongo-database.repository.spec.ts`** in this folder: a **`StubMongoRepository`** extends the base with **`useFactory`** / mocked **`MongoService`**.
