import { InvalidBooleanException } from '@/shared/domain/exceptions/value-objects/invalid-boolean/invalid-boolean.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Represents a boolean value object with input parsing and validation.
 *
 * Encapsulates and validates boolean values for DDD-style domains, with options
 * for null/undefined and strict or flexible parsing from strings or numbers.
 *
 * @example
 * const bool1 = new BooleanValueObject(true);
 * const bool2 = new BooleanValueObject('yes');
 * const bool3 = BooleanValueObject.fromNumber(0);
 *
 * @see {@link InvalidBooleanException}
 * @public
 */
export class BooleanValueObject extends ValueObject<boolean> {
  /**
   * The underlying boolean value.
   * @internal
   */
  private readonly _value: boolean;

  /**
   * Constructs a BooleanValueObject.
   *
   * @param value - The value to wrap; accepts `boolean`, `string`, or `number`.
   * @param options - Validation and parsing options.
   *   - `allowNull`: Accepts `null` as a valid value (becomes `false`).
   *   - `allowUndefined`: Accepts `undefined` as valid value (becomes `false`).
   *   - `strictMode`: Only specific values are accepted; flexible parsing otherwise.
   *
   * @throws {@link InvalidBooleanException} if parsing is unsuccessful.
   */
  constructor(
    value: boolean | string | number,
    private readonly options: {
      allowNull?: boolean;
      allowUndefined?: boolean;
      strictMode?: boolean;
    } = {},
  ) {
    super();
    this._value = this.parseValue(value);
    this.validate();
  }

  /**
   * Gets the wrapped boolean value.
   *
   * @returns The underlying boolean.
   */
  public get value(): boolean {
    return this._value;
  }

  /**
   * Checks structural equality with another `BooleanValueObject`.
   *
   * @param other - Another instance to compare against.
   * @returns `true` if values are equal, else `false`.
   */
  public equals(other: BooleanValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Determines if the value is strictly `true`.
   *
   * @returns `true` if the value is `true`, else `false`.
   */
  public isTrue(): boolean {
    return this._value === true;
  }

  /**
   * Determines if the value is strictly `false`.
   *
   * @returns `true` if the value is `false`, else `false`.
   */
  public isFalse(): boolean {
    return this._value === false;
  }

  /**
   * Returns a new value object with the negated value.
   *
   * @returns New `BooleanValueObject` with logical-`NOT` of current value.
   */
  public not(): BooleanValueObject {
    return new BooleanValueObject(!this._value, this.options);
  }

  /**
   * Performs logical-AND with another BooleanValueObject.
   *
   * @param other - The other operand.
   * @returns New value object representing `this.value && other.value`.
   */
  public and(other: BooleanValueObject): BooleanValueObject {
    return new BooleanValueObject(this._value && other._value, this.options);
  }

  /**
   * Performs logical-OR with another BooleanValueObject.
   *
   * @param other - The other operand.
   * @returns New value object representing `this.value || other.value`.
   */
  public or(other: BooleanValueObject): BooleanValueObject {
    return new BooleanValueObject(this._value || other._value, this.options);
  }

  /**
   * Performs logical-XOR with another BooleanValueObject.
   *
   * @param other - The other operand.
   * @returns New value object representing `this.value !== other.value`.
   */
  public xor(other: BooleanValueObject): BooleanValueObject {
    return new BooleanValueObject(this._value !== other._value, this.options);
  }

  /**
   * Returns the boolean as a string representation (`'true'` or `'false'`).
   *
   * @returns A string corresponding to the boolean value.
   */
  public toString(): string {
    return this._value.toString();
  }

  /**
   * Returns the boolean as a number (`1` for true, `0` for false).
   *
   * @returns The numeric representation.
   */
  public toNumber(): number {
    return this._value ? 1 : 0;
  }

  /**
   * Creates a BooleanValueObject from a string.
   *
   * @param value - The string to parse (e.g. `'yes'`, `'false'`).
   * @returns New BooleanValueObject instance.
   * @throws {@link InvalidBooleanException} if parsing fails.
   */
  public static fromString(value: string): BooleanValueObject {
    return new BooleanValueObject(value);
  }

  /**
   * Creates a BooleanValueObject from a number.
   *
   * @param value - The number to parse (`1`, `0`, or flexible).
   * @returns New BooleanValueObject instance.
   * @throws {@link InvalidBooleanException} if parsing fails.
   */
  public static fromNumber(value: number): BooleanValueObject {
    return new BooleanValueObject(value);
  }

  /**
   * Factory method for a `true` BooleanValueObject.
   *
   * @returns An instance where value is `true`.
   */
  public static true(): BooleanValueObject {
    return new BooleanValueObject(true);
  }

  /**
   * Factory method for a `false` BooleanValueObject.
   *
   * @returns An instance where value is `false`.
   */
  public static false(): BooleanValueObject {
    return new BooleanValueObject(false);
  }

  /**
   * Parses and converts input values to a strict boolean.
   *
   * Flexible (default) parsing allows typical representations:
   * - `true`, `"yes"`, `"1"`, `"on"`, and `"enabled"` → `true`
   * - `false`, `"no"`, `"0"`, `"off"`, and `"disabled"` → `false`
   * - numbers: 1 or >0 (true), 0 (false)
   *
   * With `strictMode`: only `"true"`/`"false"`/`1`/`0` accepted.
   *
   * @param value - Input to parse.
   * @returns Parsed boolean.
   * @throws {@link InvalidBooleanException} if unable to parse.
   * @internal
   */
  private parseValue(value: boolean | string | number): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();

      if (this.options.strictMode) {
        if (lowerValue === 'true') return true;
        if (lowerValue === 'false') return false;
        throw new InvalidBooleanException(`Invalid boolean string: ${value}`);
      }

      // More flexible parsing
      if (['true', '1', 'yes', 'on', 'enabled'].includes(lowerValue)) {
        return true;
      }
      if (['false', '0', 'no', 'off', 'disabled'].includes(lowerValue)) {
        return false;
      }

      throw new InvalidBooleanException(
        `Cannot convert string to boolean: ${value}`,
      );
    }

    if (typeof value === 'number') {
      if (this.options.strictMode) {
        if (value === 1) return true;
        if (value === 0) return false;
        throw new InvalidBooleanException(`Invalid boolean number: ${value}`);
      }

      // More flexible parsing
      if (value === 1 || value > 0) return true;
      if (value === 0) return false;

      throw new InvalidBooleanException(
        `Cannot convert number to boolean: ${value}`,
      );
    }

    if (value === null && this.options.allowNull) {
      return false;
    }

    if (value === undefined && this.options.allowUndefined) {
      return false;
    }

    throw new InvalidBooleanException(`Invalid boolean value: ${value}`);
  }

  /**
   * Validates the internal state of the value object.
   *
   * Throws a domain exception on invalid value (already handled by parsing).
   * Override to add custom invariants.
   *
   * @protected
   */
  protected validate(): void {
    // Additional validation can be added here if needed.
    // For now, the parsing logic handles most validation.
  }
}
