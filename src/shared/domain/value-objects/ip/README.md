# IP value object (`IpValueObject`)

Validates a non-empty **IPv4** or **IPv6** string (trimmed). Exposes helpers for version, private, and loopback detection. IPv6 validation is **simplified** (full forms and some compressed forms); edge-case IPv6 strings may be rejected or behave conservatively.

Extends [`ValueObject<string>`](../base/value-object.base.ts). Throws **`InvalidIpException`** when empty or invalid.

---

## Import

```typescript
import { IpValueObject, InvalidIpException } from '@sisques-labs/nestjs-kit';
```

---

## Constructor

```typescript
new IpValueObject(value: string)
```

`null` / `undefined` are coerced to `''` then fail validation.

---

## API

| Member | Description |
|--------|-------------|
| `value` | Trimmed IP string. |
| `equals(other)` | String equality. |
| `isIPv4()` | Contains `.` and no `:`. |
| `isIPv6()` | Contains `:`. |
| `getVersion()` | `4` or `6` based on the above heuristics. |
| `isPrivate()` | Private ranges (IPv4 10/8, 172.16–31, 192.168; IPv6 ULA `fc`/`fd` prefix heuristic). |
| `isLoopback()` | IPv4 `127.*` or `::1`. |

---

## Examples

```typescript
new IpValueObject('192.168.1.1');
new IpValueObject('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
```

---

## Related

- **Tests:** `ip.vo.spec.ts`
- **Exception:** `InvalidIpException`
