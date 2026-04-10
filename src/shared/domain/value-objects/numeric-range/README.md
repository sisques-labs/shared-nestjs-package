# Numeric range value object (`NumericRangeValueObject`)

`NumericRangeValueObject` represents a closed numeric interval `{ min, max }` where **`min` must not be greater than `max`**. It is a small domain primitive for filters, budgets, thresholds, pagination bounds, or any concept modeled as “from … to …” on a number line.

It extends [`ValueObject<INumericRange>`](../base/value-object.base.ts). The wrapped value is the plain object `{ min, max }`.

---

## Import

```typescript
import {
  NumericRangeValueObject,
  INumericRange,
} from '@sisques-labs/shared-nestjs';
import { InvalidNumericRangeException } from '@sisques-labs/shared-nestjs';
```

Use `InvalidNumericRangeException` when you need to catch or translate errors.

---

## `INumericRange`

```typescript
interface INumericRange {
  min: number;
  max: number;
}
```

Both bounds are **inclusive**: a value `x` is “in range” when `min <= x <= max` (you typically check that in your domain service or with a helper; this value object only validates the range definition itself).

---

## Quick start

```typescript
const ageBand = new NumericRangeValueObject({ min: 18, max: 65 });

console.log(ageBand.min);  // 18
console.log(ageBand.max);  // 65
console.log(ageBand.value); // { min: 18, max: 65 }
```

**Degenerate range:** `min === max` is valid (a single-point interval).

```typescript
const exact = new NumericRangeValueObject({ min: 42, max: 42 });
```

---

## Constructor

```typescript
new NumericRangeValueObject(range: INumericRange)
```

| Property | Type | Description |
|----------|------|-------------|
| `range.min` | `number` | Lower bound (inclusive). |
| `range.max` | `number` | Upper bound (inclusive). |

### Validation

The only built-in rule is:

- **`min` must be ≤ `max`.** If `min > max`, the constructor throws **`InvalidNumericRangeException`**.

There is **no** built-in check that `min` / `max` are finite, integers, or non-negative. Add that logic in a subclass (see [Extending](#extending-for-stricter-rules)) or validate before constructing.

---

## Instance API

| Member | Description |
|--------|-------------|
| `get min(): number` | Lower bound. |
| `get max(): number` | Upper bound. |
| `get value(): INumericRange` | `{ min, max }` (same shape as input). |
| `toPrimitives(): INumericRange` | Plain object for persistence or APIs (here equivalent to `value`). |
| `equals(other: NumericRangeValueObject): boolean` | `true` if both `min` and `max` are strictly equal (`===`). |

Inherited from `ValueObject` (usable as on other VOs): `toString()`, `isDefined()`, `isNullOrUndefined()`.

---

## Errors: `InvalidNumericRangeException`

Thrown when `min > max`. Message shape:

```text
Range min ({min}) cannot be greater than max ({max})
```

---

## Example: checking a value against the range

This value object does **not** include a `contains(n)` method; keep that in your domain or a small helper:

```typescript
function isInNumericRange(n: number, range: NumericRangeValueObject): boolean {
  return n >= range.min && n <= range.max;
}

const salaryRange = new NumericRangeValueObject({ min: 30_000, max: 80_000 });
isInNumericRange(50_000, salaryRange); // true
```

---

## Extending for stricter rules

The class is documented as a **base** for domain-specific ranges. Override `validate()`, call **`super.validate()` first** to keep the `min <= max` rule, then add your own checks.

```typescript
class PositiveNumericRange extends NumericRangeValueObject {
  constructor(range: INumericRange) {
    super(range);
  }

  protected validate(): void {
    super.validate();
    if (this._min < 0 || this._max < 0) {
      throw new Error('Range bounds must be non-negative');
    }
  }
}
```

Replace the generic `Error` with your domain exception type where appropriate.

---

## GraphQL helpers in this package

For HTTP/GraphQL layers, the library also exposes DTOs (separate from this value object):

- `NumericRangeInputDto` — GraphQL input with `min` / `max`
- `NumericRangeResponseDto` — GraphQL object type for responses

Wire them in resolvers or controllers, then map to `NumericRangeValueObject` in the application or domain layer so invalid ranges still fail inside the domain.

---

## Related types

- **Interface:** [`INumericRange`](../../interfaces/numeric-range.interface.ts)
- **Base class:** [`ValueObject`](../base/value-object.base.ts)
- **Exception:** `InvalidNumericRangeException`
- **Tests:** `numeric-range.vo.spec.ts` in this folder
