import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid String Exception
 * This exception is thrown when a string value is invalid.
 */
export class InvalidStringException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
