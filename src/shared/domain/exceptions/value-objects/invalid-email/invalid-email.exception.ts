import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Email Exception
 * This exception is thrown when an email value is invalid.
 */
export class InvalidEmailException extends BaseException {

	constructor(message: string) {
		super(message);
	}
}
