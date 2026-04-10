# Boolean value object (`BooleanValueObject`)

Normalizes **`boolean`**, **`string`**, or **`number`** inputs into a strict `boolean`, with optional **strict parsing** and optional handling of `null` / `undefined`. Extends [`ValueObject<boolean>`](../base/value-object.base.ts). Throws **`InvalidBooleanException`** when the input cannot be parsed.

---

## Import

```typescript
import { BooleanValueObject, InvalidBooleanException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new BooleanValueObject(value, options?)
```

| Argument | Type | Description |
|----------|------|-------------|
| `value` | `boolean \| string \| number` | Source value to normalize. |
| `options.allowNull` | `boolean` | When `true`, `null` is treated as **`false`** (see implementation). |
| `options.allowUndefined` | `boolean` | When `true`, `undefined` is treated as **`false`**. |
| `options.strictMode` | `boolean` | Tightens string/number parsing (see below). |

---

## Parsing rules

### Booleans

Returned as-is.

### Strings (non-strict)

**True:** `true`, `1`, `yes`, `on`, `enabled` (case-insensitive, trimmed).  
**False:** `false`, `0`, `no`, `off`, `disabled`.  
Anything else → `InvalidBooleanException`.

### Strings (strict)

Only **`true`** / **`false`** (case-insensitive) are accepted.

### Numbers (non-strict)

**True:** `1` or any **positive** number (`value > 0`).  
**False:** `0`.  
Other values (e.g. negative numbers) → exception.

### Numbers (strict)

Only **`1`** (true) and **`0`** (false).

---

## Instance API

| Member | Description |
|--------|-------------|
| `value` | `boolean` |
| `equals(other)` | Same boolean |
| `isTrue()` / `isFalse()` | Predicates |
| `not()` / `and()` / `or()` / `xor()` | Return new `BooleanValueObject` with same options |
| `toString()` | `'true'` / `'false'` (overrides base) |
| `toNumber()` | `1` / `0` |

### Static factories

`BooleanValueObject.true()`, `.false()`, `.fromString(s)`, `.fromNumber(n)` — convenience wrappers around the constructor.

---

## Examples

```typescript
new BooleanValueObject('yes').value;        // true
new BooleanValueObject(0).value;            // false
new BooleanValueObject('true', { strictMode: true }).value; // true

BooleanValueObject.fromString('off').value; // false
```

---

## Related

- **Tests:** `boolean.vo.spec.ts`
- **Exception:** `InvalidBooleanException`
