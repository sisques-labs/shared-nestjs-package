# Phone value object (`PhoneValueObject`)

Normalizes input to **E.164-style** storage: leading `+`, digits only after normalization, validates **ITU-T E.164 length** rules used in code (`+[1-9]` then digits; total length between **8 and 16** characters including `+`, i.e. roughly 7–15 digits).

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidPhoneException`** when empty or format invalid.

---

## Import

```typescript
import { PhoneValueObject, InvalidPhoneException } from '@sisques-labs/shared-nestjs';
```

---

## Normalization

1. Strip all characters except digits and `+`.
2. If the string does not start with `+`, prepend `+`.

---

## Constructor

```typescript
new PhoneValueObject(value: string)
```

---

## API

| Member | Description |
|--------|-------------|
| `value` | Normalized international form. |
| `getCountryCode()` | Leading digit group after `+` (regex `^\+(\d{1,4})`) or `null`. |
| `getNationalNumber()` | Remaining digits (implementation strips `+{countryCode}` when detected). |
| `toE164()` | Ensures leading `+`. |
| `equals(other)` | Inherited from base pattern in class — compare `value`. |

---

## Examples

```typescript
new PhoneValueObject('+34 612 345 678');
new PhoneValueObject('34612345678'); // becomes '+34612345678'
```

---

## Related

- **Tests:** `phone.vo.spec.ts`
- **Exception:** `InvalidPhoneException`
- **Country prefix VO:** [`PhoneCodeValueObject`](../phone-code/README.md)
