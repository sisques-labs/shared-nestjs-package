import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Enum Value Exception
 * This exception is thrown when an enum value is invalid.
 */
export class InvalidEnumValueException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
