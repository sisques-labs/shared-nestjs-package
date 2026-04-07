import { BaseException } from '@/shared/domain/exceptions/base.exception';

describe('BaseException', () => {
  const testMessage = 'Test error message';

  describe('constructor', () => {
    it('should create an exception with the provided message', () => {
      const exception = new BaseException(testMessage);

      expect(exception.message).toBe(testMessage);
    });

    it('should set the name to the class name', () => {
      const exception = new BaseException(testMessage);

      expect(exception.name).toBe('BaseException');
    });

    it('should create a timestamp when the exception is created', () => {
      const beforeCreation = new Date();
      const exception = new BaseException(testMessage);
      const afterCreation = new Date();

      expect(exception.timestamp).toBeInstanceOf(Date);
      expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(exception.timestamp.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should be an instance of Error', () => {
      const exception = new BaseException(testMessage);

      expect(exception).toBeInstanceOf(Error);
    });
  });

  describe('getDetailedMessage', () => {
    it('should return a formatted error message with name', () => {
      const exception = new BaseException(testMessage);
      const detailedMessage = exception.getDetailedMessage();

      expect(detailedMessage).toBe(`[BaseException]: ${testMessage}`);
    });

    it('should include the custom message in the detailed message', () => {
      const customMessage = 'Custom error message';
      const exception = new BaseException(customMessage);
      const detailedMessage = exception.getDetailedMessage();

      expect(detailedMessage).toContain(customMessage);
    });
  });

  describe('toJSON', () => {
    it('should return a JSON object with all exception properties', () => {
      const exception = new BaseException(testMessage);
      const json = exception.toJSON();

      expect(json).toHaveProperty('name', 'BaseException');
      expect(json).toHaveProperty('message', testMessage);
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('stack');
    });

    it('should convert timestamp to ISO string', () => {
      const exception = new BaseException(testMessage);
      const json = exception.toJSON();

      expect((json as any).timestamp).toBe(exception.timestamp.toISOString());
      expect(typeof (json as any).timestamp).toBe('string');
    });

    it('should include the stack trace', () => {
      const exception = new BaseException(testMessage);
      const json = exception.toJSON();

      expect((json as any).stack).toBeDefined();
      expect(typeof (json as any).stack).toBe('string');
    });
  });
});
