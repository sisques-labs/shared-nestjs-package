# Phone code value object (`PhoneCodeValueObject`)

Represents an international **dialing prefix** such as `+34` or `+1`. Built on [`StringValueObject`](../string/string.vo.ts) with pattern **`^\+[1-9]\d{0,3}$`**, length **2–5**, trim on. By default, the code must appear in a large **built-in allowlist** of common country codes; otherwise **`InvalidStringException`** is thrown.

---

## Import

```typescript
import { PhoneCodeValueObject, InvalidStringException } from '@sisques-labs/shared-nestjs';
```

---

## Constructor

```typescript
new PhoneCodeValueObject(value, options?)
```

| Option | Default | Description |
|--------|---------|-------------|
| `allowEmpty` | `false` | Passed through to `StringValueObject`. |
| `validateExistence` | `true` | If not `false`, value must be in the internal common-codes set after normalization. |

### Normalization (`normalizePhoneCode`)

- Trims; ensures leading `+`; strips non-digits except `+`.

---

## API

| Member | Description |
|--------|-------------|
| `value` | e.g. `+34` |
| `static fromString(code, options?)` | Constructor alias. |
| `exists()` | In allowlist. |
| `getNumericCode()` | Without `+`. |
| `getFullCode()` | With `+`. |
| `isValidFormat()` | Regex check. |
| `isNorthAmerican()` | `+1` |
| `isEuropean()` | Small EU-style code list in implementation. |
| `getRegionName()` | Optional human label for a subset of codes. |
| `equals(other)` | Value equality. |

Inherits other [`StringValueObject`](../string/README.md) helpers.

---

## Examples

```typescript
new PhoneCodeValueObject('+34');
new PhoneCodeValueObject('34'); // normalized to '+34'

new PhoneCodeValueObject('+999', { validateExistence: false }); // if not in list
```

---

## Related

- **Parent:** [`StringValueObject`](../string/README.md)
- **Phone numbers:** [`PhoneValueObject`](../phone/README.md)
- **Tests:** `phone-code.vo.spec.ts`
