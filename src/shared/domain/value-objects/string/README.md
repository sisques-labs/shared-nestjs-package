# String value object (`StringValueObject`)

Wraps a **string** with optional validation: length bounds, empty allowance, trim, regex pattern, and case-sensitive or case-insensitive equality. Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidStringException`** when a rule fails.

---

## Import

```typescript
import { StringValueObject, InvalidStringException } from '@sisques-labs/shared-nestjs';
```

---

## Constructor

```typescript
new StringValueObject(value, options?)
```

| Option | Type | Default / behaviour |
|--------|------|---------------------|
| `minLength` | `number` | If set, string length must be ≥ this value. **Skipped** when `allowEmpty: true` and the value is empty after processing. |
| `maxLength` | `number` | If set, string length must be ≤ this value. |
| `allowEmpty` | `boolean` | If `false` (implicit when you rely on empty check), empty string is invalid. If `true`, empty string is allowed and min/pattern checks may be skipped for empty values. |
| `trim` | `boolean` | Default **true**: trim whitespace before validation. Set `trim: false` to keep leading/trailing spaces. |
| `pattern` | `RegExp` | If set, the whole string must match. Skipped for empty string when `allowEmpty: true`. |
| `caseSensitive` | `boolean` | Affects **`equals`**, **`contains`**, **`startsWith`**, **`endsWith`**, and string transforms that compare case (`replace`). Default: case-sensitive equality. |

### Input coercion

`null` / `undefined` are coerced to `''` before trim/validation.

---

## Instance methods

| Method | Description |
|--------|-------------|
| `equals(other)` | Compares with `other.value`; if `caseSensitive === false`, compares lowercased. |
| `isEmpty()` / `isNotEmpty()` | Length checks. |
| `length()` | Character length. |
| `contains` / `startsWith` / `endsWith` | Substring checks; honour `caseSensitive`. |
| `toLowerCase()` / `toUpperCase()` / `capitalize()` / `trim()` | Return **new** `StringValueObject` instances with the same options. |
| `replace(search, replaceWith)` | Returns new VO; case-insensitive mode uses `gi` regex. |
| `split(delimiter)` | Returns `StringValueObject[]` per segment. |
| `matches(pattern)` | Regex test. |
| `isEmail()` / `isUrl()` / `isNumeric()` / `isAlphanumeric()` / `isAlphabetic()` | Convenience predicates (not enforced in constructor unless you use `pattern`). |

---

## Examples

```typescript
const name = new StringValueObject('  Ada  ', { minLength: 1, maxLength: 100 });
// trimmed to 'Ada' by default

const code = new StringValueObject('abc123', {
  pattern: /^[a-z0-9]+$/,
  allowEmpty: false,
});

const tag = new StringValueObject('Hello', { caseSensitive: false });
tag.equals(new StringValueObject('hello', { caseSensitive: false })); // true
```

---

## Subclasses in this library

`SlugValueObject`, `LocaleValueObject`, `TimezoneValueObject`, and `PhoneCodeValueObject` extend `StringValueObject` with fixed patterns and extra rules. See their folders for details.

---

## Related

- **Base:** [`ValueObject`](../base/value-object.base.ts)
- **Tests:** `string.vo.spec.ts`
