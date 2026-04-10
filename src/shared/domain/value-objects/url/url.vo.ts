import { InvalidUrlException } from '@/shared/domain/exceptions/value-objects/invalid-url/invalid-url.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Url Value Object
 * This value object is responsible for encapsulating the URL of a resource.
 * It ensures that the URL is a valid URL and that it is not empty.
 * @param value - The URL of the resource.
 * @returns A new instance of the UrlValueObject.
 */
export class UrlValueObject extends ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = value;
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  protected validate(): void {
    this.checkIsEmpty();
    this.checkIsUrl();
  }

  private checkIsEmpty(): void {
    if (!this._value) {
      throw new InvalidUrlException('URL cannot be empty');
    }
  }

  private checkIsUrl(): void {
    if (!this._value.startsWith('http')) {
      throw new InvalidUrlException('URL must start with http');
    }
  }
}
