# Value object base (`ValueObject<T>`)

`ValueObject<T>` is the abstract base class for domain **value objects** in this library: small, immutable types that wrap a value (`T`), **validate themselves in the constructor**, and are compared by **value**, not identity.

Concrete value objects in the package (for example `NumberValueObject`, `StringValueObject`) extend this class. You can extend it in your own codebase for custom domain concepts.

---

## Import

```typescript
import { ValueObject } from '@sisques-labs/nestjs-kit';
```

---

## Responsibilities

| Concern | How it is modeled |
|--------|------------------|
| **Immutability** | Subclasses should use `readonly` fields and expose no setters. |
| **Self-validation** | Subclasses implement `validate()` and **must call it at the end of the constructor** after all fields are set. |
| **Wrapped value** | Exposed through the abstract `value` getter. |
| **Equality & serialization** | Default helpers are provided; subclasses may override when semantics differ (e.g. case-insensitive string equality). |

---

## Scalar vs composite `T`

- **Scalar / single concept:** `T` is `string`, `number`, `boolean`, `Date`, etc. One private field is enough.
- **Composite:** `T` is an object type that groups every attribute, e.g. `{ content: string; variables: Record<string, string> }`. Use **several** `private readonly` fields (`_content`, `_variables`, …) and make `get value()` return a **plain object** of type `T` (copying into new objects/arrays so the VO stays immutable). Example:

```typescript
export class PromptBody extends ValueObject<{
  content: string;
  variables: Record<string, string>;
}> {
  private readonly _content: string;
  private readonly _variables: Readonly<Record<string, string>>;

  constructor(content: string, variables: Record<string, string>) {
    super();
    this._content = content;
    this._variables = { ...variables };
    this.validate();
  }

  get value() {
    return { content: this._content, variables: { ...this._variables } };
  }

  protected validate(): void {
    /* domain rules */
  }
}
```

If some parts are themselves value objects in your domain, either flatten them inside `value` as primitives or override `cloneForPrimitives` to call `toPrimitives()` on nested VOs.

---

## What you must implement

### `get value(): T`

Returns the full aggregate (primitive or composite). For composites, build it from your private fields.

### `protected validate(): void`

Enforce domain rules. On failure, throw a **domain exception** from this package (e.g. `InvalidStringException`) or your own `BaseException` subclass—**do not** leave the object in an invalid state.

**Contract:** call `this.validate()` as the **last step** of your constructor, after assigning every field. The base class does not call it for you.

---

## Provided methods

### `equals(other: ValueObject<T>): boolean`

Default implementation:

1. Returns `false` if `other` is not a `ValueObject` instance.
2. Otherwise uses **`protected valuesAreEqual(a, b)`**, which defaults to comparing `JSON.stringify(a)` and `JSON.stringify(b)`.

**Prefer overriding `valuesAreEqual`** when only the comparison of two `T` values should change (e.g. order-insensitive arrays, normalized strings) while keeping the `instanceof` guard.

**Override `equals` entirely** when you need a narrower parameter type (e.g. `equals(other: MyVo): boolean`).

**Caveat:** `JSON.stringify` skips some values (e.g. `undefined` in objects) and does not handle `BigInt`, `Symbol`, or circular structures.

---

### `toPrimitives(): T`

Calls **`protected cloneForPrimitives(this.value)`**. The default:

- **`null` / `undefined`:** returned as-is.
- **Objects:** deep-cloned via `JSON.parse(JSON.stringify(value))`.
- **Primitives:** returned as-is.

**Override `cloneForPrimitives`** when `T` is composite and contains types JSON mishandles or nested value objects that expose their own `toPrimitives()`. You can still override `toPrimitives()` directly if you prefer (as some package VOs do).

**Caveat:** the JSON round-trip **drops** non-JSON types (`Date`, `Map`/`Set`, etc.).

---

### `toString(): string`

- `null` / `undefined` → `''`
- Objects → `JSON.stringify(value)`
- Otherwise → `String(value)`

---

### `isDefined(): boolean` / `isNullOrUndefined(): boolean`

These inspect **`this.value`**:

- `isDefined()` is `true` when `value` is neither `null` nor `undefined`.
- `isNullOrUndefined()` is the negation.

Useful for value objects whose type parameter allows optional presence (`T` includes `null` or `undefined`). For strictly non-null wrapped types, `isDefined()` is always `true` after a successful construction.

---

## Minimal subclass example

```typescript
import { ValueObject } from '@sisques-labs/nestjs-kit';

export class Code extends ValueObject<string> {
  private readonly _value: string;

  constructor(raw: string) {
    super();
    this._value = raw.trim().toUpperCase();
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  protected validate(): void {
    if (!/^[A-Z0-9]{3,10}$/.test(this._value)) {
      throw new Error('Invalid code format');
    }
  }
}
```

Swap the generic `Error` for a domain exception type used in your bounded context.

---

## Extending another value object in this library

Some concrete types (for example `NumericRangeValueObject`) are intended as bases for stricter ranges. When you **override** `validate()` on a subclass, call **`super.validate()`** first if you still want the parent’s rules, then add your own checks. Always align with how the parent constructor assigns fields and invokes `validate()`.

---

## Tests

See `value-object.base.spec.ts` in this folder for behaviour of `equals`, `toPrimitives`, `toString`, and constructor-time validation.

---

## See also

- Other value objects under `src/shared/domain/value-objects/` (each may document specific options and exceptions).
- Domain exceptions under `src/shared/domain/exceptions/` for validation failures.
