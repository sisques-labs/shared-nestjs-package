import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Represents an immutable value object encapsulating a JavaScript Date.
 * Provides methods for comparison and formatting.
 *
 * @public
 */
export class DateValueObject extends ValueObject<Date> {
  private readonly _value: Date;

  /**
   * Creates a new DateValueObject.
   *
   * @param date - The date to encapsulate. If not provided, defaults to the current date and time.
   */
  constructor(date?: Date) {
    super();
    this._value = date ?? new Date();
    this.validate();
  }

  /**
   * Validates the encapsulated date.
   * Override to provide custom validation logic if needed.
   *
   * @protected
   */
  protected validate(): void {}

  /**
   * Gets the encapsulated Date instance.
   *
   * @returns The underlying {@link Date} object.
   */
  public get value(): Date {
    return this._value;
  }

  /**
   * Converts the encapsulated date to an ISO 8601 string.
   *
   * @returns The ISO string representation of the encapsulated date.
   */
  public toISOString(): string {
    return this._value.toISOString();
  }

  /**
   * Compares this DateValueObject with another to determine equality.
   *
   * @param other - The other {@link DateValueObject} to compare against.
   * @returns `true` if both encapsulated dates are equal (by time value), otherwise `false`.
   */
  public equals(other: DateValueObject): boolean {
    return this._value.getTime() === other.value.getTime();
  }
}
