import { InvalidHexException } from '@/shared/domain/exceptions/value-objects/invalid-hex/invalid-hex.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Hex Value Object
 * This value object is responsible for encapsulating hexadecimal values.
 * It ensures that the value is a valid hexadecimal string.
 * @param value - The hexadecimal string.
 * @returns A new instance of the HexValueObject.
 */
export class HexValueObject extends ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = (value ?? '').toLowerCase();
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  /**
   * Converts the hex value to a number
   * @returns The numeric representation of the hex value
   */
  public toNumber(): number {
    return parseInt(this._value, 16);
  }

  /**
   * Converts the hex value to a buffer
   * @returns The buffer representation of the hex value
   */
  public toBuffer(): Buffer {
    return Buffer.from(this._value, 'hex');
  }

  protected validate(): void {
    this.checkIsEmpty();
    this.checkIsHex();
  }

  private checkIsEmpty(): void {
    if (!this._value || this._value.trim() === '') {
      throw new InvalidHexException('Hex value cannot be empty');
    }
  }

  private checkIsHex(): void {
    const hexPattern = /^[0-9a-fA-F]+$/;
    if (!hexPattern.test(this._value)) {
      throw new InvalidHexException('Value must be a valid hexadecimal string');
    }
  }
}
