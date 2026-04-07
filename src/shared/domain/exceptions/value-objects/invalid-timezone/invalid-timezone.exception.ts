import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * InvalidTimezoneException
 * Exception thrown when a timezone value is invalid
 */
export class InvalidTimezoneException extends BaseException {
  constructor(message: string) {
    super(message);
    this.name = InvalidTimezoneException.name;
  }
}
