import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Phone Exception
 * This exception is thrown when a phone number value is invalid.
 */
export class InvalidPhoneException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
