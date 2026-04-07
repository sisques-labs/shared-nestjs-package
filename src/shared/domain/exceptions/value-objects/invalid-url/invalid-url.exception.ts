import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid URL Exception
 * This exception is thrown when a URL value is invalid.
 */
export class InvalidUrlException extends BaseException {

	constructor(message: string) {
		super(message);
	}
}
