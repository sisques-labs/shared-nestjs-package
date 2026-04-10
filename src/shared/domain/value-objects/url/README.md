# URL value object (`UrlValueObject`)

Validates a non-empty string that **starts with `http`** (i.e. `http://` or `https://` — case-sensitive prefix check). This is a **lightweight** check, not a full WHATWG URL parse in the validator.

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidUrlException`** when empty or when the prefix rule fails.

---

## Import

```typescript
import { UrlValueObject, InvalidUrlException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new UrlValueObject(value: string)
```

---

## Validation summary

1. Value must be truthy (non-empty).
2. `value.startsWith('http')` must be `true`.

URLs using other schemes (`ftp:`, `mailto:`, custom schemes) are **rejected** by this value object.

---

## Examples

```typescript
new UrlValueObject('https://example.com/path');
// throws InvalidUrlException for '' or 'ftp://example.com'
```

If you need broader scheme support, validate with the `URL` constructor in your own VO or extend this class.

---

## Related

- **Tests:** `url.vo.spec.ts`
- **Exception:** `InvalidUrlException`
