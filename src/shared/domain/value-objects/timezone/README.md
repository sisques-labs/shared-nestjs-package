# Timezone value object (`TimezoneValueObject`)

Represents an **IANA-style** timezone identifier string (e.g. `Europe/Madrid`, `America/New_York`). Length is constrained (3–50) via [`StringValueObject`](../string/string.vo.ts). By default the value must exist in a **built-in allowlist** of common zones; otherwise **`InvalidTimezoneException`**.

---

## Import

```typescript
import { TimezoneValueObject, InvalidTimezoneException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new TimezoneValueObject(value, options?)
```

| Option | Default | Description |
|--------|---------|-------------|
| `allowEmpty` | `false` | Passed to `StringValueObject`. |
| `validateExistence` | `true` | If not `false`, value must be in the package’s common timezone set. |

### `normalizeTimezone`

Trims the string; invalid types → `''`.

---

## API

| Member | Description |
|--------|-------------|
| `static fromString(timezone, options?)` | Constructor alias. |
| `exists()` | In allowlist. |
| `isUTC()` | `value === 'UTC'`. |
| `getRegion()` / `getCity()` | Split on `/` (`Region/City`). |
| `isEuropean()` / `isAmerican()` / `isAsian()` | Region prefix checks. |

Inherits [`StringValueObject`](../string/README.md) helpers.

---

## Examples

```typescript
new TimezoneValueObject('Europe/Madrid');
new TimezoneValueObject('Custom/Zone', { validateExistence: false });
```

For runtime validation against the full IANA database, consider additional checks outside this VO.

---

## Related

- **Parent:** [`StringValueObject`](../string/README.md)
- **Tests:** `timezone.vo.spec.ts`
