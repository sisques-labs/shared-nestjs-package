# MongoDB DTOs

This folder holds **TypeScript types** (and future DTO classes) that describe **persistence shapes** for MongoDB documents — plain data aligned with what the driver reads and writes, not domain value objects.

---

## `BaseMongoDto`

A **`type`** (not a class) for the common audit/identity slice of stored documents:

```typescript
export type BaseMongoDto = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Use it as the **intersection base** for collection-specific DTOs:

```typescript
import { BaseMongoDto } from '@sisques-labs/nestjs-kit';

export type UserMongoDto = BaseMongoDto & {
  email: string;
  name: string;
};
```

---

## Relationship to mappers and repositories

- **Mappers** (see **`../mappers/README.md`**) typically convert **`TMongoDto extends BaseMongoDto`** ↔ view models / aggregates.
- **Repositories** use **`Collection`** from the driver; after **`find`**, documents are often typed or asserted as your **`XxxMongoDto`** before mapping.

---

## Runtime note

MongoDB may return **`Date`** fields or **ISO strings** depending on serialization. Mappers can use **`BaseMongoDBMapper.normalizeMongoDate`** for consistent **`Date`** instances in the domain layer.
