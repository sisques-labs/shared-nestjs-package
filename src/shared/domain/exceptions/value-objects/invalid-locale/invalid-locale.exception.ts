import { BaseException } from '@/shared/domain/exceptions/base.exception';

/**
 * InvalidLocaleException
 * Exception thrown when a locale value is invalid
 */
export class InvalidLocaleException extends BaseException {
	constructor(message: string) {
		super(message);
		this.name = InvalidLocaleException.name;
	}
}
