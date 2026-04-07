import { BaseException } from '@/shared/domain/exceptions/base.exception';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('InvalidEnumValueException', () => {
  const testMessage = 'Invalid enum value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidEnumValueException(testMessage);

    expect(exception).toBeInstanceOf(BaseException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidEnumValueException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidEnumValueException', () => {
    const exception = new InvalidEnumValueException(testMessage);

    expect(exception.name).toBe('InvalidEnumValueException');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidEnumValueException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(`[InvalidEnumValueException]: ${testMessage}`);
  });
});
