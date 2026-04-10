# Dimensions value object (`DimensionsValueObject`)

Represents **length, width, height** as positive finite numbers plus a [`LengthUnitValueObject`](../length-unit/length-unit.vo.ts) (or any string accepted by that VO). Optional **numeric options** mirror [`NumberValueObject`](../number/README.md): `min`, `max`, `allowDecimals`, `precision`. Each dimension must be **> 0** in addition to any `min`/`max` you pass.

Extends `ValueObject<{ length, width, height, unit: string }>`. Throws **`InvalidDimensionsException`**.

---

## Import

```typescript
import {
  DimensionsValueObject,
  LengthUnitValueObject,
  InvalidDimensionsException,
} from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new DimensionsValueObject(
  { length, width, height, unit },
  options?,
)
```

| Field | Type | Description |
|-------|------|-------------|
| `length` / `width` / `height` | `number \| string` | Parsed with `parseFloat` when string. |
| `unit` | `string` | Passed to `LengthUnitValueObject` (enum-backed). |

| Option | Description |
|--------|-------------|
| `min` / `max` | Applied to **each** dimension (inclusive bounds on top of “must be > 0”). |
| `allowDecimals` | If `false`, each side must be an integer. |
| `precision` | Max decimal places per dimension. |

---

## Static factory

```typescript
DimensionsValueObject.fromNullable(
  { length, width, height, unit },
  { throwOnInvalid?, min?, max?, allowDecimals?, precision? },
)
```

Returns **`null`** if any required field is missing/blank, unless `throwOnInvalid: true`, then throws **`InvalidDimensionsException`** listing missing fields.

---

## API

| Member | Description |
|--------|-------------|
| `length` / `width` / `height` | Numbers |
| `unit` | `LengthUnitValueObject` |
| `value` | Plain `{ length, width, height, unit: string }` |
| `toPrimitives()` | Same shape as `value` |
| `getVolume()` | `l × w × h` |
| `getBaseArea()` | `l × w` |
| `getSurfaceArea()` | Full cuboid surface |
| `getLateralSurfaceArea()` | Side faces only |
| `getLongestDimension()` / `getShortestDimension()` | `Math.max` / `min` |
| `isCube()` | All three edges equal |
| `equals(other)` | All numbers and unit VO equal |

---

## Example

```typescript
import { LengthUnitEnum } from '@sisques-labs/nestjs-kit';

const d = new DimensionsValueObject(
  { length: 10, width: 5, height: 3, unit: LengthUnitEnum.CENTIMETER },
  { allowDecimals: false },
);
d.getVolume(); // 150
```

---

## Related

- **Unit:** [`LengthUnitValueObject`](../length-unit/README.md)
- **Tests:** `dimensions.vo.spec.ts`
