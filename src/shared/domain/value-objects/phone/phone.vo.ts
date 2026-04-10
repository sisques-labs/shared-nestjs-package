import { InvalidPhoneException } from '@/shared/domain/exceptions/value-objects/invalid-phone/invalid-phone.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Phone Value Object
 * This value object is responsible for encapsulating phone numbers.
 * It ensures that the phone number is valid and properly formatted.
 * @param value - The phone number.
 * @returns A new instance of the PhoneValueObject.
 */
export class PhoneValueObject extends ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = this.normalize(value ?? '');
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  /**
   * Gets the country code from the phone number
   * @returns The country code or null if not found
   */
  public getCountryCode(): string | null {
    const match = this._value.match(/^\+(\d{1,4})/);
    return match ? match[1] : null;
  }

  /**
   * Gets the national number (without country code)
   * @returns The national number
   */
  public getNationalNumber(): string {
    const countryCode = this.getCountryCode();
    if (countryCode) {
      return this._value.replace(`+${countryCode}`, '');
    }
    return this._value;
  }

  /**
   * Formats the phone number in E.164 format
   * @returns The phone number in E.164 format
   */
  public toE164(): string {
    return this._value.startsWith('+') ? this._value : `+${this._value}`;
  }

  protected validate(): void {
    this.checkIsEmpty();
    this.checkIsValidPhone();
  }

  private checkIsEmpty(): void {
    if (!this._value || this._value.trim() === '') {
      throw new InvalidPhoneException('Phone number cannot be empty');
    }
  }

  private checkIsValidPhone(): void {
    // _value is already normalized: starts with +, only digits/+
    const internationalPattern = /^\+[1-9]\d{1,14}$/;

    if (!internationalPattern.test(this._value)) {
      throw new InvalidPhoneException('Invalid phone number format');
    }

    // +1234567 = 8 chars min, +1234567890123456 = 17 chars max
    if (this._value.length < 8 || this._value.length > 16) {
      throw new InvalidPhoneException(
        'Phone number must be between 7 and 15 digits',
      );
    }
  }

  private normalize(value: string): string {
    // Remove all non-digit characters except +
    let normalized = value.replace(/[^\d+]/g, '');

    // If it doesn't start with +, add it
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    return normalized;
  }
}
