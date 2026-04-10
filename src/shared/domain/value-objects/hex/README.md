# Hex value object (`HexValueObject`)

Wraps a non-empty **hexadecimal string** (digits `0-9`, `a-f`; stored **lowercased**). Useful for binary IDs, color components, or serialized bytes as hex.

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidHexException`** when empty or non-hex.

---

## Import

```typescript
import { HexValueObject, InvalidHexException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new HexValueObject(value: string)
```

`null` / `undefined` become `''` and fail validation.

---

## API

| Member | Description |
|--------|-------------|
| `value` | Lowercase hex string. |
| `toNumber()` | `parseInt(value, 16)` — may lose precision for long strings. |
| `toBuffer()` | `Buffer.from(value, 'hex')` — invalid length pairs are handled by Node (`Buffer` may truncate/pad per Node rules). |

---

## Examples

```typescript
new HexValueObject('FF00aa').value; // 'ff00aa'
new HexValueObject('deadbeef').toBuffer();
```

---

## Related

- **Tests:** `hex.vo.spec.ts`
- **Colors as `#rrggbb`:** [`ColorValueObject`](../color/README.md) (different rules)
