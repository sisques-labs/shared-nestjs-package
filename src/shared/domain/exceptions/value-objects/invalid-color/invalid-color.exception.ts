import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * Invalid Color Exception
 * This exception is thrown when a color value is invalid.
 */
export class InvalidColorException extends BaseException {

	constructor(message: string) {
		super(message);
	}
}
