# Password value object (`PasswordValueObject`)

Stores a **plaintext password string** in the value object for validation and strength hints. It enforces **minimum length (8)**, rejects a small **common-password** list, and exposes **strength scoring** helpers. It does **not** hash passwords—hash in your application/infrastructure layer before persistence.

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidPasswordException`** when validation fails.

---

## Import

```typescript
import { PasswordValueObject, InvalidPasswordException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor validation

| Rule | Behaviour |
|------|-----------|
| Non-empty | Whitespace-only is invalid. |
| Length | At least **8** characters. |
| Common passwords | Rejects a built-in list (`password`, `123456`, `qwerty`, etc.), compared case-insensitively. |

There is **no** mandatory complexity rule in the constructor (no required upper/lower/digit)—use `meetsRequirements()` when you need that gate in code.

---

## API

| Member | Description |
|--------|-------------|
| `value` | Raw password string (handle securely; avoid logging). |
| `equals(other)` | String equality. |
| `getStrengthScore()` | Heuristic **0–100** (length, character classes, penalties for repeats/simple sequences). |
| `getStrengthLevel()` | `'weak' \| 'medium' \| 'strong' \| 'very-strong'` from score. |
| `meetsRequirements()` | `true` if length ≥ 8 and contains lower, upper, and digit. |

---

## Examples

```typescript
const pwd = new PasswordValueObject('Str0nger!9');
pwd.getStrengthLevel();
pwd.meetsRequirements(); // true if all character classes present
```

---

## Security note

Treat `value` as sensitive. Prefer running strength checks **client-side or server-side** without persisting the VO beyond the registration/change-password flow, and always store **hashes** (e.g. Argon2/bcrypt) in your user store.

---

## Related

- **Tests:** `password.vo.spec.ts`
- **Exception:** `InvalidPasswordException`
