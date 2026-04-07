import { BaseException } from '@/shared/domain/exceptions/base.exception';
import { InvalidEmailException } from '@/shared/domain/exceptions/value-objects/invalid-email/invalid-email.exception';

describe('InvalidEmailException', () => {
  const testMessage = 'Invalid email value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception).toBeInstanceOf(BaseException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidEmailException', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception.name).toBe('InvalidEmailException');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidEmailException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(`[InvalidEmailException]: ${testMessage}`);
  });
});
