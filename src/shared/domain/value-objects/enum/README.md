# Enum value object base (`EnumValueObject<T>`)

Abstract base for **string-backed enum value objects**. Subclasses provide **`protected get enumObject(): T`** where `T` is `Record<string, string | number>`. The constructor accepts a **`string`** value that must appear in `Object.values(enumObject)` (compared as string). Throws **`InvalidEnumValueException`** if empty or not a valid enum value.

The wrapped `value` is always a **string** (`ValueObject<string>` semantics for `value` getter).

---

## Import

```typescript
import { EnumValueObject, InvalidEnumValueException } from '@sisques-labs/nestjs-kit';
```

---

## Implementing a concrete enum VO

```typescript
import { MyEnum } from './my.enum';
import { EnumValueObject } from '@sisques-labs/nestjs-kit';

export class MyEnumValueObject extends EnumValueObject<typeof MyEnum> {
  protected get enumObject(): typeof MyEnum {
    return MyEnum;
  }
}

// Usage (string enum values):
new MyEnumValueObject(MyEnum.FOO); // or 'FOO' if values are strings
```

See [`LengthUnitValueObject`](../length-unit/README.md) for a package example.

---

## Constructor

```typescript
// abstract — concrete subclass
new ConcreteEnumVo('SOME_VALUE')
```

Validation:

1. Non-empty after trim.
2. `_value` must be in `Object.values(this.enumObject)` (strict inclusion).

---

## Instance API (selection)

| Method | Description |
|--------|-------------|
| `equals(other)` | Same string value |
| `is(v)` / `isOneOf` / `isNotOneOf` | Compare to raw enum value(s) |
| `getKey()` | Enum key for current value, if any |
| `getAllValues()` / `getAllKeys()` / `getAllEntries()` | Introspection |
| `isValidValue(v)` | Membership test |
| `getNextValue()` / `getPreviousValue()` / `getRandomValue()` | Order follows `Object.values` order |
| `getIndex()` / `getCount()` | Position / size |
| `toDisplayString()` / `toSlug()` / `toConstant()` | Formatting from key name |
| `withValue` / `withNextValue` / `withPreviousValue` / `withRandomValue` | New instance |
| `toNumber()` / `isNumeric()` | If value parses as number |
| `getDescription()` / `toJSON()` | Debug / serialization helpers |
| `static fromJSON` | Rehydrate from `{ value }` JSON |

---

## Related

- **Example implementation:** [`LengthUnitValueObject`](../length-unit/README.md)
- **Tests:** `enum.vo.spec.ts`; concrete enums may have additional specs
- **Exception:** `InvalidEnumValueException`
