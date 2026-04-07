import { BaseException } from '@/shared/domain/exceptions/base.exception';

export class InvalidNumericRangeException extends BaseException {

	constructor(min: number, max: number) {
		super(`Range min (${min}) cannot be greater than max (${max})`);
	}
}
