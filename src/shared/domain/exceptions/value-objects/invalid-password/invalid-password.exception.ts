import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Password Exception
 * This exception is thrown when a password value is invalid.
 */
export class InvalidPasswordException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
