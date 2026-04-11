# MongoDB mappers

**MongoDB kit overview:** [../README.md](../README.md)

This folder contains **infrastructure mappers** between **MongoDB persistence shapes** (plain DTOs aligned with stored documents) and **domain-facing types** (typically view models and, when needed, aggregates).

The kit ships **`BaseMongoDBMapper`**, an abstract Nest injectable that forces a consistent mapping API in consuming applications.

---

## Import

```typescript
import { BaseMongoDBMapper, BaseMongoDto } from '@sisques-labs/nestjs-kit';
```

---

## `BaseMongoDBMapper<TViewModel, TMongoDto, TAggregate>`

| Type parameter | Role |
|----------------|------|
| **`TViewModel`** | Type returned for read paths (queries, projections). Often a view model or a read DTO. |
| **`TMongoDto`** | Document shape used with the Mongo driver. Must extend **`BaseMongoDto`** (`id`, `createdAt`, `updatedAt`) plus collection-specific fields. |
| **`TAggregate`** | Type used when mapping a document into a richer domain aggregate (write model / domain rules), if your bounded context needs it. |

### Methods you implement

| Method | Direction | Purpose |
|--------|-----------|---------|
| **`toViewModel(doc)`** | Persistence → read model | Build `TViewModel` from a stored document. |
| **`toMongoData(viewModel)`** | Read model → persistence | Serialize `TViewModel` into `TMongoDto` for inserts/updates. |
| **`toAggregate(doc)`** | Persistence → domain | Build `TAggregate` from a document when the write model differs from the view model. |

### Helpers on the base class

- **`normalizeMongoDate(value)`** (`protected`): use when `createdAt` / `updatedAt` (or other dates) may arrive as **`Date`** or **ISO strings** from the driver or JSON. Returns a **`Date`**.

---

## Extending in your project

1. Define a Mongo DTO type (intersection with **`BaseMongoDto`**).
2. Extend **`BaseMongoDBMapper`** with your three type arguments.
3. Implement the three abstract methods.
4. Register the concrete class in a Nest **`providers`** array wherever repositories or handlers need it.

```typescript
import { Injectable } from '@nestjs/common';
import { BaseMongoDBMapper, BaseMongoDto } from '@sisques-labs/nestjs-kit';

type PromptMongoDto = BaseMongoDto & {
  name: string;
  content: string;
};

@Injectable()
export class PromptMongoDBMapper extends BaseMongoDBMapper<
  PromptViewModel,
  PromptMongoDto,
  PromptAggregate
> {
  toViewModel(doc: PromptMongoDto): PromptViewModel {
    return new PromptViewModel({
      id: doc.id,
      name: doc.name,
      content: doc.content,
      createdAt: this.normalizeMongoDate(doc.createdAt),
      updatedAt: this.normalizeMongoDate(doc.updatedAt),
    });
  }

  toMongoData(viewModel: PromptViewModel): PromptMongoDto {
    return {
      id: viewModel.id,
      name: viewModel.name,
      content: viewModel.content,
      createdAt: viewModel.createdAt,
      updatedAt: viewModel.updatedAt,
    };
  }

  toAggregate(doc: PromptMongoDto): PromptAggregate {
    // Rehydrate domain from persistence
  }
}
```

If a bounded context only needs **view models** and **documents** (no separate aggregate type), you can still pick a third type that fits your design (for example the same as the view model, or a dedicated “document aggregate” type) as long as **`toAggregate`** remains meaningful for that module.

---

## Relationship to repositories

- **Repositories** load and persist documents; they usually depend on a **mapper** to convert `TMongoDto` ↔ domain types.
- Keep **query/filter construction** in **`BaseMongoDatabaseRepository`** subclasses (or your own base); keep **field-by-field mapping** in **`BaseMongoDBMapper`** subclasses.

---

## Testing

Prefer unit tests on concrete mappers: fixed `TMongoDto` instances in, assert `TViewModel` / `TAggregate` / round-trips through **`toMongoData`** where relevant. The kit includes a small spec for **`BaseMongoDBMapper`** using a private stub class to verify the protected date helper and the public contract.
