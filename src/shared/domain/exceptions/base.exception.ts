/**
 * Base Exception
 * This is the base class for all exceptions.
 * It provides a common structure for all exceptions.
 */
export class BaseException extends Error {
  public readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
  }

  /**
   * Gets a detailed error description
   * @returns A formatted error description
   */
  public getDetailedMessage(): string {
    return `[${this.name}: ${this.message}`;
  }

  /**
   * Converts the exception to JSON
   * @returns JSON representation of the exception
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
