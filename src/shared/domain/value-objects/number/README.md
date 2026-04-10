# Number value object (`NumberValueObject`)

`NumberValueObject` wraps a numeric value and validates it when the object is constructed. It is useful in domain models where numbers must always satisfy rules (ranges, integers only, decimal precision) and where invalid input should fail fast with a clear domain exception.

It extends the shared [`ValueObject`](../base/value-object.base.ts) base type, so you also get `toPrimitives()`, `toString()`, `isDefined()`, and `isNullOrUndefined()` from the base class.

---

## Import

After installing `@sisques-labs/shared-nestjs`:

```typescript
import {
  NumberValueObject,
} from '@sisques-labs/shared-nestjs';
import { InvalidNumberException } from '@sisques-labs/shared-nestjs';
```

(`InvalidNumberException` is thrown when validation fails; import it if you need to catch or map errors.)

---

## Quick start

```typescript
const quantity = new NumberValueObject(10);
console.log(quantity.value); // 10

// String input is parsed with JavaScript's parseFloat (see “String input” below)
const fromString = new NumberValueObject('3.14');
console.log(fromString.value); // 3.14
```

---

## Constructor

```typescript
new NumberValueObject(value, options?)
```

| Argument | Type | Description |
|----------|------|-------------|
| `value` | `number \| string` | The number to wrap. Strings are parsed before validation. |
| `options` | `object` (optional) | Constraints; see [Options](#options). Defaults to `{}` (no extra constraints beyond finiteness). |

If anything is invalid, the constructor throws **`InvalidNumberException`** immediately. There is no “invalid state” instance.

---

## Options

All options are optional and can be combined.

| Option | Type | Effect |
|--------|------|--------|
| `min` | `number` | Value must be **≥ `min`** (inclusive). |
| `max` | `number` | Value must be **≤ `max`** (inclusive). |
| `allowDecimals` | `boolean` | If `false`, the value must be an **integer** (`Number.isInteger`). |
| `precision` | `number` | Maximum **decimal places** allowed (counted from the string form of the number after parsing). |

### Examples

```typescript
// Percentage between 0 and 100
const pct = new NumberValueObject(50, { min: 0, max: 100 });

// Count of items: whole numbers only
const count = new NumberValueObject(3, { allowDecimals: false });

// Money-like: at most 2 decimal places
const price = new NumberValueObject(19.99, { precision: 2 });
```

---

## What gets validated (and in what order)

1. **Parsing** — If `value` is a string, it is parsed with `parseFloat`. Unparseable strings throw `InvalidNumberException` with message `Invalid number format`.
2. **Finite** — `Infinity`, `-Infinity`, and `NaN` are rejected (`Number must be finite`).
3. **Range** — If `min` / `max` are set, the value must lie inside the inclusive bounds.
4. **Decimals** — If `allowDecimals: false`, the value must be an integer.
5. **Precision** — If `precision` is set, the number of digits after the decimal point must not exceed that limit.

---

## Instance methods

| Method | Description |
|--------|-------------|
| `get value(): number` | The validated `number`. |
| `equals(other: NumberValueObject): boolean` | `true` if both wrap the same numeric value (`===`). |
| `isInRange(min, max): boolean` | Inclusive range check (independent of constructor `min`/`max`). |
| `isPositive(): boolean` | Strictly greater than zero. |
| `isNegative(): boolean` | Strictly less than zero. |
| `isZero(): boolean` | Exactly zero. |
| `round(precision?: number): number` | Returns a **new** rounded number; default `precision` is `2`. Does **not** change the stored `value`. |

### Rounding note

`round()` uses standard rounding to the nearest value at the given decimal places; the internal `_value` is unchanged. If you need the aggregate or entity to hold the rounded value, assign a new `NumberValueObject` (with appropriate options) or store the result of `round()` explicitly.

---

## Errors: `InvalidNumberException`

Subclass of the package’s domain `BaseException`. Typical messages:

| Situation | Message (examples) |
|-----------|---------------------|
| Bad string | `Invalid number format` |
| Not finite | `Number must be finite` |
| Below `min` | `Number must be at least {min}` |
| Above `max` | `Number must be at most {max}` |
| Fraction when integers required | `Number must be an integer` |
| Too many decimals | `Number cannot have more than {precision} decimal places` |

In NestJS you can catch this in filters or map it to an HTTP 400 with your API’s error shape.

---

## String input (`parseFloat` behaviour)

String values use **`parseFloat`**, which matches common JavaScript behaviour:

- Leading whitespace is trimmed; valid numeric prefixes are accepted.
- **`"42abc"` parses as `42`** (only the leading numeric part is used). If you need to reject such strings, validate the string yourself before constructing the value object, or accept only `number` from your DTO layer.

Scientific notation (e.g. `"1e3"`) parses as a normal number and is then validated like any other value.

---

## Using it in domain code

Typical pattern: construct the value object when creating or updating an entity so invalid numbers never enter the aggregate.

```typescript
class OrderLine {
  constructor(
    private readonly quantity: NumberValueObject,
    private readonly unitPrice: NumberValueObject,
  ) {}

  static create(qty: number, price: number) {
    return new OrderLine(
      new NumberValueObject(qty, { min: 1, allowDecimals: false }),
      new NumberValueObject(price, { min: 0, precision: 2 }),
    );
  }
}
```

Persist or expose primitives with `.value` or `.toPrimitives()` depending on your mapping layer.

---

## Related types

- **Base class:** [`ValueObject<T>`](../base/value-object.base.ts)
- **Exception:** `InvalidNumberException` in the shared domain exceptions module
- **Tests:** `number.vo.spec.ts` in this folder (examples of accepted and rejected inputs)
