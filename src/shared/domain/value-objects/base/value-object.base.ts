/**
 * Abstract base class for all Value Objects in the domain.
 *
 * Value Objects are immutable, self-validating objects that are compared
 * by their value rather than identity.
 * All concrete Value Objects must extend this class and implement {@link validate}.
 *
 * @typeParam T The **aggregate** this value object represents: a primitive, a single
 * domain concept, or a **composite** plain shape (e.g. `{ content: string; variables: Record<string, string> }`).
 * For multi-attribute VOs, store each part in `private readonly` fields and let {@link value}
 * return a single object of type `T` (or override {@link cloneForPrimitives} / {@link valuesAreEqual} when needed).
 *
 * @public
 */
export abstract class ValueObject<T> {
  /**
   * Full domain value: one primitive, one tuple-like structure, or one object that groups every attribute.
   *
   * @returns {T} The encapsulated value (scalar or composite).
   * @public
   * @readonly
   */
  public abstract get value(): T;

  /**
   * Validates the internal state of the ValueObject.
   *
   * Implementations must throw a domain-specific exception if the value is invalid.
   * This method MUST be called at the end of every concrete constructor, after all fields are assigned.
   *
   * @protected
   * @abstract
   * @throws {Error} Concrete implementations should throw a domain exception type when invalid.
   */
  protected abstract validate(): void;

  /**
   * Compares two aggregate values for equality. Default: `JSON.stringify` of both sides.
   * Override for composite `T` when key order, nested types, or semantics differ from JSON equality.
   *
   * @param a - First aggregate (typically `this.value`).
   * @param b - Second aggregate (typically `other.value`).
   * @returns {boolean} Whether the two aggregates should be considered equal.
   * @protected
   */
  protected valuesAreEqual(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  /**
   * Structural equality based on the wrapped value.
   *
   * Subclasses may override {@link valuesAreEqual} instead of this method when only the comparison logic differs,
   * or override this method entirely (e.g. to narrow the parameter type to a concrete VO class).
   *
   * @param other The other ValueObject to compare with.
   * @returns {boolean} `true` if both value objects are equal by wrapped value, otherwise `false`.
   * @public
   */
  public equals(other: ValueObject<T>): boolean {
    if (!(other instanceof ValueObject)) return false;
    return this.valuesAreEqual(this.value, other.value);
  }

  /**
   * Maps `value` to a plain, serializable copy. Default uses a JSON round-trip for objects.
   * Override when `T` contains fields that `JSON.stringify` mishandles or when nested value objects
   * must be flattened via their own `toPrimitives()`.
   *
   * @param value - The aggregate returned by {@link value}.
   * @returns {T} Plain representation safe for persistence or transport.
   * @protected
   */
  protected cloneForPrimitives(value: T): T {
    if (value === null || value === undefined) return value;
    if (typeof value === 'object') return JSON.parse(JSON.stringify(value)) as T;
    return value;
  }

  /**
   * Creates a deeply serializable/plain copy of the wrapped value.
   *
   * For primitives, this returns the value unchanged (via {@link cloneForPrimitives}).
   * For objects, default is a deep clone suitable for transport or persistence.
   *
   * @returns {T} The plain representation.
   * @public
   */
  public toPrimitives(): T {
    return this.cloneForPrimitives(this.value);
  }

  /**
   * Returns a human-readable string representation of the wrapped value.
   *
   * @returns {string} String representation.
   * @public
   */
  public toString(): string {
    const v = this.value;
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  /**
   * Indicates whether the wrapped value is neither `null` nor `undefined`.
   *
   * @returns {boolean} `true` if value is defined.
   * @public
   */
  public isDefined(): boolean {
    const v = this.value;
    return v !== null && v !== undefined;
  }

  /**
   * Indicates whether the wrapped value is `null` or `undefined`.
   *
   * @returns {boolean} `true` if value is null or undefined.
   * @public
   */
  public isNullOrUndefined(): boolean {
    return !this.isDefined();
  }
}
