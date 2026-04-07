import { BaseException } from '@/shared/domain/exceptions/base.exception';
import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json/invalid-json.exception';

describe('InvalidJsonException', () => {
  const testMessage = 'Invalid JSON value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception).toBeInstanceOf(BaseException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidJsonException', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception.name).toBe('InvalidJsonException');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidJsonException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(`[InvalidJsonException]: ${testMessage}`);
  });
});
