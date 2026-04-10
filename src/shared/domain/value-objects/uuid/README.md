# UUID value object (`UuidValueObject`)

Wraps a **RFC 4122** UUID string (versions 1–5). Validates format on construction, optionally generates a random UUID when no value is passed, and exposes small helpers (`getVersion`, `isNil`).

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidUuidException`** when the value is empty or malformed.

---

## Import

```typescript
import { UuidValueObject, InvalidUuidException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new UuidValueObject(value?: string)
```

| Argument | Description |
|----------|-------------|
| `value` | Optional. If omitted or `undefined`, a new **v4-style** random UUID is generated via `crypto.randomUUID()`. If provided, must match the internal RFC 4122 pattern (version nibble 1–5, variant bits `8`/`9`/`a`/`b`). |

---

## API

| Member | Description |
|--------|-------------|
| `get value(): string` | Canonical UUID string. |
| `equals(other: UuidValueObject): boolean` | Same string (`===`). |
| `getVersion(): number \| null` | UUID version (1–5) if parseable, else `null`. |
| `isNil(): boolean` | `true` for the nil UUID `00000000-0000-0000-0000-000000000000`. |
| `static generate(): UuidValueObject` | Same as `new UuidValueObject()` (random UUID). |

---

## Examples

```typescript
const id = UuidValueObject.generate();
const copy = new UuidValueObject(id.value);

const fixed = new UuidValueObject('550e8400-e29b-41d4-a716-446655440000');
```

---

## Typed identifier value objects

Semantic wrappers (`UserUuidValueObject`, `PlantUuidValueObject`, etc.) extend this class with **no extra validation**. Use them to make IDs type-distinct in TypeScript. See [`../identifiers/README.md`](../identifiers/README.md).

---

## Related

- **Tests:** `uuid.vo.spec.ts`
- **Exception:** `InvalidUuidException`
