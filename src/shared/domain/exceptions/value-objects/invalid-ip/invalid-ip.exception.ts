import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid IP Exception
 * This exception is thrown when an IP address value is invalid.
 */
export class InvalidIpException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
