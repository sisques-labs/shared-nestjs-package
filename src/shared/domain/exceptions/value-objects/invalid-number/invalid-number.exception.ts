import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Number Exception
 * This exception is thrown when a number value is invalid.
 */
export class InvalidNumberException extends BaseException {

	constructor(message: string) {
		super(message);
	}
}
