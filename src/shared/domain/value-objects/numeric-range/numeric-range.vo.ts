import { InvalidNumericRangeException } from '@/shared/domain/exceptions/value-objects/invalid-numeric-range/invalid-numeric-range.exception';
import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Represents a value object for a closed numeric range `{ min, max }`.
 *
 * Ensures that `min` is not greater than `max`.
 * Immutable and self-validating domain primitive for numeric intervals,
 * such as ranges used for filters, quotas, thresholds, or pagination bounds.
 *
 * Extends {@link ValueObject} for structural equality and serialization support.
 *
 * Subclass and override {@link validate} to enforce additional constraints.
 *
 * @remarks
 * - Both `min` and `max` are inclusive bounds.
 * - Throws {@link InvalidNumericRangeException} if the range is invalid.
 * - Value is always available via the `value` getter as `{ min, max }`.
 *
 * @example
 * ```typescript
 * const range = new NumericRangeValueObject({ min: 5, max: 10 });
 * console.log(range.min); // 5
 * console.log(range.max); // 10
 * ```
 */
export class NumericRangeValueObject extends ValueObject<INumericRange> {
  /**
   * The lower bound of the range (inclusive).
   * @internal
   */
  protected readonly _min: number;

  /**
   * The upper bound of the range (inclusive).
   * @internal
   */
  protected readonly _max: number;

  /**
   * Constructs a new NumericRangeValueObject.
   *
   * @param range - The range object with `min` and `max` numeric values.
   * @throws {@link InvalidNumericRangeException} if `min` is greater than `max`.
   */
  constructor(range: INumericRange) {
    super();
    this._min = range.min;
    this._max = range.max;
    this.validate();
  }

  /**
   * Gets the lower bound (inclusive).
   */
  public get min(): number {
    return this._min;
  }

  /**
   * Gets the upper bound (inclusive).
   */
  public get max(): number {
    return this._max;
  }

  /**
   * Gets the raw range value as `{ min, max }`.
   */
  public get value(): INumericRange {
    return { min: this._min, max: this._max };
  }

  /**
   * Returns a plain serializable copy of the wrapped range.
   */
  public toPrimitives(): INumericRange {
    return { min: this._min, max: this._max };
  }

  /**
   * Structural equality: Two NumericRangeValueObjects are equal if both
   * `min` and `max` values are strictly equal.
   *
   * @param other - Another NumericRangeValueObject.
   * @returns `true` if both ranges are identical, else `false`.
   */
  public equals(other: NumericRangeValueObject): boolean {
    return this._min === other._min && this._max === other._max;
  }

  /**
   * Validates the numeric range.
   *
   * @throws {@link InvalidNumericRangeException} if `min > max`.
   * Can be overridden for domain-specific constraints.
   */
  protected validate(): void {
    if (this._min > this._max) {
      throw new InvalidNumericRangeException(this._min, this._max);
    }
  }
}
