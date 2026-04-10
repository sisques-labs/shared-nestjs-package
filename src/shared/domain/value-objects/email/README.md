# Email value object (`EmailValueObject`)

Normalizes and validates an **email address** string: lowercased, trimmed, non-empty, and matched against a **practical regex** (documented in code as RFC 5322–oriented). Also enforces **total length ≤ 254** and **local part ≤ 64** characters.

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidEmailException`** when invalid.

---

## Import

```typescript
import { EmailValueObject, InvalidEmailException } from '@sisques-labs/shared-nestjs';
```

---

## Constructor

```typescript
new EmailValueObject(value: string)
```

`null` / `undefined` are coerced to `''` before normalization, which then fails the empty check.

---

## API

| Member | Description |
|--------|-------------|
| `value` | Normalized email (lowercase). |
| `equals(other)` | Same normalized string. |
| `getLocalPart()` | Part before `@`. |
| `getDomain()` | Part after `@`. |

---

## Examples

```typescript
const email = new EmailValueObject(' User@Example.COM ');
email.value;           // 'user@example.com'
email.getDomain();     // 'example.com'
```

---

## Related

- **Tests:** `email.vo.spec.ts`
- **Exception:** `InvalidEmailException`
