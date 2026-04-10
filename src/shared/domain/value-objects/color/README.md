# Color value object (`ColorValueObject`)

Accepts a non-empty string in one of these **formats** (trimmed, lowercased for storage):

- **Hex:** `#rgb` or `#rrggbb`
- **RGB:** `rgb(r, g, b)` with integer components
- **HSL:** `hsl(h, s%, l%)` with integer `h` and percentage `s`/`l`
- **Named:** `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `black`, `white`, `gray`, `grey`, `brown`, `cyan`, `magenta`

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidColorException`** when empty or not matching any format.

---

## Import

```typescript
import { ColorValueObject, InvalidColorException } from '@sisques-labs/shared-nestjs';
```

---

## API

| Member | Description |
|--------|-------------|
| `value` | Normalized input string in original format family. |
| `isHex()` / `isRgb()` / `isHsl()` | Format detectors. |
| `toHex()` / `toRgb()` / `toHsl()` | Conversions where implemented; some HSL↔RGB paths are **stubs** in code (return `value` unchanged). Prefer hex/RGB for reliable round-trips until those paths are completed. |

---

## Examples

```typescript
new ColorValueObject('#336699');
new ColorValueObject('rgb(10, 20, 30)');
new ColorValueObject('red');
```

---

## Related

- **Tests:** `color.vo.spec.ts`
- **Raw hex strings (no `#`):** [`HexValueObject`](../hex/README.md)
