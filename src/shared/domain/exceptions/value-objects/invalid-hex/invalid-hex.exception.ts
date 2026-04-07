import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Hex Exception
 * This exception is thrown when a hexadecimal value is invalid.
 */
export class InvalidHexException extends BaseException {

	constructor(message: string) {
		super(message);
	}
}
