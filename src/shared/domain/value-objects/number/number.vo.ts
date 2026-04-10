import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Number Value Object
 *
 * A value object to encapsulate and validate a numeric value.
 * Constraints such as minimum, maximum, decimal allowance, and precision can be specified via options.
 *
 * @remarks
 * Ensures the value is finite and satisfies all configured constraints.
 * Throws {@link InvalidNumberException} on invalid input.
 */
export class NumberValueObject extends ValueObject<number> {
  /**
   * The encapsulated numeric value.
   * @internal
   */
  private readonly _value: number;

  /**
   * Constructs a new NumberValueObject.
   *
   * @param value - The numeric value to wrap; may be a number or string (parseable as a number).
   * @param options - Optional constraints for validation.
   * @param options.min - Minimum allowed value (inclusive).
   * @param options.max - Maximum allowed value (inclusive).
   * @param options.allowDecimals - If false, value must be an integer.
   * @param options.precision - Maximum number of decimal places.
   *
   * @throws {@link InvalidNumberException} If validation fails.
   */
  constructor(
    value: number | string,
    private readonly options: {
      min?: number;
      max?: number;
      allowDecimals?: boolean;
      precision?: number;
    } = {},
  ) {
    super();
    this._value = this.parseValue(value);
    this.validate();
  }

  /**
   * Gets the encapsulated number value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if this NumberValueObject is equal to another instance.
   *
   * @param other - Another NumberValueObject instance.
   * @returns `true` if the encapsulated numbers are equal, otherwise `false`.
   */
  public equals(other: NumberValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Determines if the value is within the provided range (inclusive).
   *
   * @param min - The lower bound.
   * @param max - The upper bound.
   * @returns `true` if value >= min and value <= max, otherwise `false`.
   */
  public isInRange(min: number, max: number): boolean {
    return this._value >= min && this._value <= max;
  }

  /**
   * Checks if the value is strictly positive (`> 0`).
   *
   * @returns `true` if positive, otherwise `false`.
   */
  public isPositive(): boolean {
    return this._value > 0;
  }

  /**
   * Checks if the value is strictly negative (`< 0`).
   *
   * @returns `true` if negative, otherwise `false`.
   */
  public isNegative(): boolean {
    return this._value < 0;
  }

  /**
   * Checks if the value is exactly zero (`=== 0`).
   *
   * @returns `true` if the value is zero, otherwise `false`.
   */
  public isZero(): boolean {
    return this._value === 0;
  }

  /**
   * Rounds the value to the specified number of decimal places.
   *
   * @param precision - Number of decimal places (defaults to 2).
   * @returns The rounded number.
   */
  public round(precision: number = 2): number {
    return (
      Math.round(this._value * Math.pow(10, precision)) /
      Math.pow(10, precision)
    );
  }

  /**
   * Attempts to parse the user-provided value into a number.
   *
   * @param value - The value to parse, as a number or a string.
   * @returns The parsed number.
   * @throws {@link InvalidNumberException} If string value is not a valid number.
   * @internal
   */
  private parseValue(value: number | string): number {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        throw new InvalidNumberException('Invalid number format');
      }
      return parsed;
    }
    return value;
  }

  /**
   * Validates the value against all configured constraints.
   *
   * @throws {@link InvalidNumberException} If any validation fails.
   * @internal
   */
  protected validate(): void {
    this.checkIsFinite();
    this.checkRange();
    this.checkDecimals();
  }

  /**
   * Validates that the value is finite (not Infinity or NaN).
   * @throws {@link InvalidNumberException} If the value is not finite.
   * @internal
   */
  private checkIsFinite(): void {
    if (!isFinite(this._value)) {
      throw new InvalidNumberException('Number must be finite');
    }
  }

  /**
   * Validates the value against min and max constraints, if provided.
   *
   * @throws {@link InvalidNumberException} If value is outside allowed range.
   * @internal
   */
  private checkRange(): void {
    if (this.options.min !== undefined && this._value < this.options.min) {
      throw new InvalidNumberException(
        `Number must be at least ${this.options.min}`,
      );
    }

    if (this.options.max !== undefined && this._value > this.options.max) {
      throw new InvalidNumberException(
        `Number must be at most ${this.options.max}`,
      );
    }
  }

  /**
   * Validates decimal allowance and precision constraints.
   *
   * @throws {@link InvalidNumberException} If the value is not an integer when required,
   *   or has more decimal places than allowed.
   * @internal
   */
  private checkDecimals(): void {
    if (
      this.options.allowDecimals === false &&
      !Number.isInteger(this._value)
    ) {
      throw new InvalidNumberException('Number must be an integer');
    }

    if (this.options.precision !== undefined) {
      const decimalPlaces = (this._value.toString().split('.')[1] || '').length;
      if (decimalPlaces > this.options.precision) {
        throw new InvalidNumberException(
          `Number cannot have more than ${this.options.precision} decimal places`,
        );
      }
    }
  }
}
