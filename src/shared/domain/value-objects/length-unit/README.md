# Length unit value object (`LengthUnitValueObject`)

Concrete [`EnumValueObject`](../enum/README.md) for [`LengthUnitEnum`](../../enums/length-unit/length-unit.enum.ts): **`MILLIMETER`**, **`CENTIMETER`**, **`METER`**, **`INCH`**, **`FOOT`**.

---

## Import

```typescript
import {
  LengthUnitValueObject,
  LengthUnitEnum,
  InvalidEnumValueException,
} from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new LengthUnitValueObject(value: string)
```

Pass either the enum member or its string value:

```typescript
new LengthUnitValueObject(LengthUnitEnum.CENTIMETER);
new LengthUnitValueObject('CENTIMETER');
```

Invalid or empty values throw **`InvalidEnumValueException`**.

---

## API

Inherits the full [`EnumValueObject`](../enum/README.md) surface: `equals`, `is`, `isOneOf`, `getKey`, `getAllValues`, `withNextValue`, etc.

Used by [`DimensionsValueObject`](../dimensions/README.md) for the `unit` field.

---

## Related

- **Enum definition:** `LengthUnitEnum` in `src/shared/domain/enums/length-unit/`
- **Base:** [`EnumValueObject`](../enum/README.md)
- **Tests:** behaviour covered via `DimensionsValueObject` / enum tests; see `enum.vo.spec.ts` for `EnumValueObject` base.
