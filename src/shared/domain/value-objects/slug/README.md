# Slug value object (`SlugValueObject`)

URL-friendly **slug** string: lowercase letters, digits, and single hyphens between segments (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). Built on [`StringValueObject`](../string/string.vo.ts) with fixed defaults: **min length 1**, **max length 100**, **trim on**, **empty not allowed** by default.

Throws **`InvalidStringException`** (from the string layer) when validation fails.

---

## Import

```typescript
import { SlugValueObject, InvalidStringException } from '@sisques-labs/shared-nestjs';
```

---

## Constructor

```typescript
new SlugValueObject(value, options?)
```

| Option | Description |
|--------|-------------|
| `minLength` / `maxLength` | Override defaults (1 and 100). |
| `allowEmpty` | Default `false`. |
| `generateFromString` | If `true`, `value` is passed through **`SlugValueObject.generateSlug()`** before validation (normalize text into a slug). |

---

## Static helpers

| Method | Description |
|--------|-------------|
| `fromString(text, options?)` | Same as `new SlugValueObject(text, { ...options, generateFromString: true })`. |
| `generateSlug(text)` | Lowercase, trim, spaces/underscores → `-`, strip invalid chars, collapse hyphens, trim edge hyphens. Returns `''` for invalid input. |

---

## Instance methods

Inherits [`StringValueObject`](../string/README.md) methods (`contains`, `equals`, etc.). Additional:

| Method | Description |
|--------|-------------|
| `isValidSlug()` | Pattern test on current value. |
| `isEmptyOrOnlyHyphens()` | Edge-case helper. |
| `getWordCount()` | Hyphen-separated non-empty segments. |
| `toHumanReadable()` | Returns `StringValueObject` title-cased words. |
| `addSuffix(suffix)` / `addPrefix(prefix)` | New `SlugValueObject`; suffix/prefix run through `generateSlug`. |

---

## Examples

```typescript
const s = new SlugValueObject('my-post-title', { generateFromString: true });
// value: 'my-post-title'

const direct = new SlugValueObject('product-42');

SlugValueObject.fromString('Hello World!');
// 'hello-world'
```

---

## Related

- **Parent:** [`StringValueObject`](../string/README.md)
- **Tests:** `slug.vo.spec.ts`
