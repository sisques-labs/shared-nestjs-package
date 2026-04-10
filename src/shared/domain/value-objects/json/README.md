# JSON object value object (`JsonValueObject`)

Wraps a **plain JavaScript object** (`Record<string, any>`), not arrays or primitives at the top level. Accepts an object or a **JSON string** that parses to an object. Optional validation: non-empty, max nesting depth, required keys, allowed keys only, and a **simple type schema**.

Extends [`ValueObject<Record<string, any>>`](../base/value-object.base.ts). Throws **`InvalidJsonException`** when parsing or rules fail.

---

## Import

```typescript
import { JsonValueObject, InvalidJsonException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new JsonValueObject(value?, options?)
```

| `value` | Behaviour |
|---------|-----------|
| Omitted / `undefined` / `null` | Empty object `{}`. |
| `string` | `JSON.parse`; result must be a non-array object. |
| `object` | Must be non-array plain object. |

| Option | Description |
|--------|-------------|
| `allowEmpty` | If `false`, `{}` throws. |
| `maxDepth` | Max nesting depth of object values (recursive). |
| `requiredKeys` | Every listed key must exist on the object. |
| `allowedKeys` | No extra keys beyond this list. |
| `schema` | Simple map `key → expected typeof string` (`'string'`, `'number'`, `'boolean'`, `'object'`, `'array'`); all schema keys must exist with matching `typeof` (arrays checked with `Array.isArray`). |

---

## Notable methods

`toString(pretty?)`, `equals`, `isEmpty` / `isNotEmpty`, `size`, `hasKey`, `get` / `getOrDefault`, `keys` / `values` / `entries`, `merge` (optional deep merge), `pick` / `omit`, `transform`, `filter`, `validateSchema`, `getNested` / `setNested` (dot paths), `clone`.

**Note:** `toString` overrides the base `ValueObject` stringification to emit JSON; the base `toString()` behaviour does not apply.

---

## Examples

```typescript
new JsonValueObject('{"a":1}', { requiredKeys: ['a'] });

new JsonValueObject(
  { name: 'x', age: 1 },
  { allowedKeys: ['name', 'age'], schema: { name: 'string', age: 'number' } },
);
```

---

## Related

- **Tests:** `json.vo.spec.ts`
- **Exception:** `InvalidJsonException`
