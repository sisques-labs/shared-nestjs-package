import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid JSON Exception
 * This exception is thrown when a JSON value is invalid.
 */
export class InvalidJsonException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
