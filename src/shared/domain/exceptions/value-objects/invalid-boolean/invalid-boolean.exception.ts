import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Boolean Exception
 * This exception is thrown when a boolean value is invalid.
 */
export class InvalidBooleanException extends BaseException {
  constructor(message: string) {
    super(message);
    this.name = InvalidBooleanException.name;
  }
}
