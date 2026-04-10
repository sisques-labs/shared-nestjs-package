/**
 * Abstract base class for all Value Objects in the domain.
 *
 * Value Objects are immutable, self-validating objects identified by their
 * value rather than their identity. All concrete Value Objects must extend
 * this class and implement the {@link validate} method.
 *
 * @typeParam T - The primitive or composite type that this Value Object wraps.
 */
export abstract class ValueObject<T> {
  /**
   * Returns the raw wrapped value.
   */
  abstract get value(): T;

  /**
   * Validates the internal state of the Value Object.
   *
   * Implementations must throw a domain exception when the value is invalid.
   * This method MUST be called at the end of every concrete constructor, after
   * all fields have been assigned.
   */
  protected abstract validate(): void;

  /**
   * Structural equality: two Value Objects are equal when their wrapped values
   * are deeply equal.
   *
   * Subclasses may override this when they need a custom comparison (e.g.
   * case-insensitive string equality).
   *
   * @param other - The other Value Object to compare with.
   */
  public equals(other: ValueObject<T>): boolean {
    if (!(other instanceof ValueObject)) return false;
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  /**
   * Returns a plain serialisable copy of the wrapped value.
   *
   * For primitive types this is the same as {@link value}. For complex types
   * (e.g. objects) it returns a deep copy suitable for persistence or transfer.
   */
  public toPrimitives(): T {
    const v = this.value;
    if (v === null || v === undefined) return v;
    if (typeof v === 'object') return JSON.parse(JSON.stringify(v)) as T;
    return v;
  }

  /**
   * Returns a human-readable string representation of the wrapped value.
   */
  public toString(): string {
    const v = this.value;
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  /**
   * Returns `true` when the wrapped value is neither `null` nor `undefined`.
   */
  public isDefined(): boolean {
    const v = this.value;
    return v !== null && v !== undefined;
  }

  /**
   * Returns `true` when the wrapped value is `null` or `undefined`.
   */
  public isNullOrUndefined(): boolean {
    return !this.isDefined();
  }
}
