import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid UUID Exception
 * This exception is thrown when a UUID value is invalid.
 */
export class InvalidUuidException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
