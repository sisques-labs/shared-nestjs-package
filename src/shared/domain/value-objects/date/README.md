# Date value object (`DateValueObject`)

Thin wrapper around a JavaScript **`Date`** instance. Default constructor uses **`new Date()`** when no argument is given. **`validate()` is currently empty** — invalid dates (e.g. from malformed strings) are **not** rejected automatically.

Extends [`ValueObject<Date>`](../base/value-object.base.ts).

---

## Import

```typescript
import { DateValueObject } from '@sisques-labs/shared-nestjs';
```

---

## Constructor

```typescript
new DateValueObject(date?: Date)
```

| Argument | Description |
|----------|-------------|
| `date` | Optional. Wrapped reference is stored as-is when provided. |

---

## API

| Member | Description |
|--------|-------------|
| `value` | The underlying `Date`. |
| `equals(other)` | Same instant (`getTime()` equality). |
| `toISOString()` | Delegates to `Date.prototype.toISOString()`. |

Inherits `toPrimitives()`, `toString()`, etc. from [`ValueObject`](../base/README.md) — note that `toString()` uses the base implementation on the `Date` object.

---

## Examples

```typescript
const now = new DateValueObject();
const fixed = new DateValueObject(new Date('2020-01-01T00:00:00.000Z'));
```

If you need “must be valid date” or range checks, add a subclass that overrides `validate()` or validate before construction.

---

## Related

- **Base:** [`ValueObject`](../base/README.md)
- **Tests:** `date.vo.spec.ts`
