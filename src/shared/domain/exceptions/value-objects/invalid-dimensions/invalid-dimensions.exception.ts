import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Dimensions Exception
 * This exception is thrown when a dimensions value is invalid.
 */
export class InvalidDimensionsException extends BaseException {
	constructor(message: string) {
		super(message);
	}
}
