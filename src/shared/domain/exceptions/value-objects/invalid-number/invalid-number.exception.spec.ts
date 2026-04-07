import { BaseException } from '@/shared/domain/exceptions/base.exception';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';

describe('InvalidNumberException', () => {
	const testMessage = 'Invalid number value';

	it('should be an instance of BaseDomainException', () => {
		const exception = new InvalidNumberException(testMessage);

		expect(exception).toBeInstanceOf(BaseException);
		expect(exception).toBeInstanceOf(Error);
	});

	it('should create an exception with the provided message', () => {
		const exception = new InvalidNumberException(testMessage);

		expect(exception.message).toBe(testMessage);
	});

	it('should set the name to InvalidNumberException', () => {
		const exception = new InvalidNumberException(testMessage);

		expect(exception.name).toBe('InvalidNumberException');
	});


	it('should return a detailed message', () => {
		const exception = new InvalidNumberException(testMessage);
		const detailedMessage = exception.getDetailedMessage();

		expect(detailedMessage).toBe(
			`[InvalidNumberException]: ${testMessage}`,
		);
	});
});
