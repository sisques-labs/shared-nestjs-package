import { BaseException } from '@/shared/domain/exceptions/base.exception';
import { InvalidPhoneException } from '@/shared/domain/exceptions/value-objects/invalid-phone/invalid-phone.exception';

describe('InvalidPhoneException', () => {
  const testMessage = 'Invalid phone number value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidPhoneException(testMessage);

    expect(exception).toBeInstanceOf(BaseException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidPhoneException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidPhoneException', () => {
    const exception = new InvalidPhoneException(testMessage);

    expect(exception.name).toBe('InvalidPhoneException');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidPhoneException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(`[InvalidPhoneException]: ${testMessage}`);
  });
});
