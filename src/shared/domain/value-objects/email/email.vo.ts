import { InvalidEmailException } from '@/shared/domain/exceptions/value-objects/invalid-email/invalid-email.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Email Value Object
 * This value object is responsible for encapsulating email addresses.
 * It ensures that the email is valid according to RFC 5322 standards.
 * @param value - The email address.
 * @returns A new instance of the EmailValueObject.
 */
export class EmailValueObject extends ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = (value ?? '').toLowerCase().trim();
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: EmailValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Gets the local part of the email (before @)
   * @returns The local part of the email
   */
  public getLocalPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * Gets the domain part of the email (after @)
   * @returns The domain part of the email
   */
  public getDomain(): string {
    return this._value.split('@')[1];
  }

  protected validate(): void {
    this.checkIsEmpty();
    this.checkIsValidEmail();
  }

  private checkIsEmpty(): void {
    if (!this._value || this._value.trim() === '') {
      throw new InvalidEmailException('Email cannot be empty');
    }
  }

  private checkIsValidEmail(): void {
    // RFC 5322 compliant email regex
    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailPattern.test(this._value)) {
      throw new InvalidEmailException('Invalid email format');
    }

    // Additional checks
    if (this._value.length > 254) {
      throw new InvalidEmailException('Email is too long (max 254 characters)');
    }

    const localPart = this._value.split('@')[0];
    if (localPart.length > 64) {
      throw new InvalidEmailException(
        'Local part of email is too long (max 64 characters)',
      );
    }
  }
}
