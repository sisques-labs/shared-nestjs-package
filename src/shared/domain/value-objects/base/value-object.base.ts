/**
 * Abstract base class for all Value Objects in the domain.
 *
 * Value Objects are immutable, self-validating objects that are compared
 * by their value rather than identity.
 * All concrete Value Objects must extend this class and implement {@link validate}.
 *
 * @template T The primitive or composite type the ValueObject wraps.
 * @public
 */
export abstract class ValueObject<T> {
  /**
   * Gets the raw wrapped value.
   *
   * @returns {T} The encapsulated value.
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
   * Structural equality based on the wrapped value.
   *
   * Subclasses may override to compare semantically (for instance, case-insensitive strings or fuzzy matches).
   *
   * @param other The other ValueObject to compare with.
   * @returns {boolean} `true` if both value objects are equal by wrapped value, otherwise `false`.
   * @public
   */
  public equals(other: ValueObject<T>): boolean {
    if (!(other instanceof ValueObject)) return false;
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  /**
   * Creates a deeply serializable/plain copy of the wrapped value.
   *
   * For primitives, this returns the value unchanged.
   * For objects, returns a deep clone suitable for transport or persistence.
   *
   * @returns {T} The plain representation.
   * @public
   */
  public toPrimitives(): T {
    const v = this.value;
    if (v === null || v === undefined) return v;
    if (typeof v === 'object') return JSON.parse(JSON.stringify(v)) as T;
    return v;
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
