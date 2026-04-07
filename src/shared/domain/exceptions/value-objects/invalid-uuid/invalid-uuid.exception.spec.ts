import { BaseException } from '@/shared/domain/exceptions/base.exception';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('InvalidUuidException', () => {
  const testMessage = 'Invalid UUID value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception).toBeInstanceOf(BaseException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidUuidException', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception.name).toBe('InvalidUuidException');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidUuidException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(`[InvalidUuidException]: ${testMessage}`);
  });
});
