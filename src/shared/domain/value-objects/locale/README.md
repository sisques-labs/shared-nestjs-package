# Locale value object (`LocaleValueObject`)

BCP 47–style **language tag** with a restricted pattern: **`xx`** or **`xx-YY`** (language lowercased; regex in code uses `[a-z]{2}` and optional `-[A-Z]{2}` — input is **normalized to lowercase** via `normalizeLocale`, so stored values are lowercase throughout, e.g. `en`, `es-mx` if accepted by the allowlist).

Built on [`StringValueObject`](../string/string.vo.ts). By default the tag must also appear in a large **common locales** set; otherwise **`InvalidLocaleException`**. Pattern failures surface as **`InvalidStringException`** from the parent.

---

## Import

```typescript
import {
  LocaleValueObject,
  InvalidLocaleException,
  InvalidStringException,
} from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new LocaleValueObject(value, options?)
```

| Option | Default | Description |
|--------|---------|-------------|
| `allowEmpty` | `false` | Allow empty string (with parent rules). |
| `validateExistence` | `true` | If not `false`, locale must be in the built-in allowlist. |

### `normalizeLocale`

Trims and lowercases the string (invalid input types yield `''`).

---

## API

| Member | Description |
|--------|-------------|
| `static fromString(locale, options?)` | Same as constructor. |
| `exists()` | In allowlist. |
| `isValidFormat()` | Regex check. |
| `getLanguageCode()` | Part before `-`. |
| `getCountryCode()` | Part after `-`, uppercased, or `null`. |
| `hasCountryCode()` | Whether `-` is present. |
| `isEnglish()` / `isSpanish()` / `isFrench()` / `isGerman()` | Language prefix checks. |
| `getDisplayName()` | Human-readable label for known tags. |

Inherits [`StringValueObject`](../string/README.md) methods (`equals`, `length`, etc.).

---

## Examples

```typescript
new LocaleValueObject('en', { validateExistence: false });
new LocaleValueObject('es-ES'); // must be in common list when validateExistence is true
```

---

## Related

- **Parent:** [`StringValueObject`](../string/README.md)
- **Tests:** `locale.vo.spec.ts`
