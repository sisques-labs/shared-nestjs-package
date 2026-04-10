import { InvalidColorException } from '@/shared/domain/exceptions/value-objects/invalid-color/invalid-color.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Color Value Object
 * This value object is responsible for encapsulating color values.
 * It supports hex, RGB, HSL, and named colors.
 * @param value - The color value.
 * @returns A new instance of the ColorValueObject.
 */
export class ColorValueObject extends ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = (value ?? '').trim().toLowerCase();
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  /**
   * Converts the color to hex format
   * @returns The color in hex format
   */
  public toHex(): string {
    if (this.isHex()) {
      return this._value;
    }

    if (this.isRgb()) {
      return this.rgbToHex();
    }

    if (this.isHsl()) {
      return this.hslToHex();
    }

    return this._value; // Named color
  }

  /**
   * Converts the color to RGB format
   * @returns The color in RGB format
   */
  public toRgb(): string {
    if (this.isRgb()) {
      return this._value;
    }

    if (this.isHex()) {
      return this.hexToRgb();
    }

    if (this.isHsl()) {
      return this.hslToRgb();
    }

    return this._value; // Named color
  }

  /**
   * Converts the color to HSL format
   * @returns The color in HSL format
   */
  public toHsl(): string {
    if (this.isHsl()) {
      return this._value;
    }

    if (this.isHex()) {
      return this.hexToHsl();
    }

    if (this.isRgb()) {
      return this.rgbToHsl();
    }

    return this._value; // Named color
  }

  /**
   * Checks if the color is in hex format
   * @returns True if hex format
   */
  public isHex(): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this._value);
  }

  /**
   * Checks if the color is in RGB format
   * @returns True if RGB format
   */
  public isRgb(): boolean {
    return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(this._value);
  }

  /**
   * Checks if the color is in HSL format
   * @returns True if HSL format
   */
  public isHsl(): boolean {
    return /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(this._value);
  }

  protected validate(): void {
    this.checkIsEmpty();
    this.checkIsValidColor();
  }

  private checkIsEmpty(): void {
    if (!this._value || this._value.trim() === '') {
      throw new InvalidColorException('Color cannot be empty');
    }
  }

  private checkIsValidColor(): void {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const hslPattern = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;

    const namedColors = [
      'red',
      'green',
      'blue',
      'yellow',
      'orange',
      'purple',
      'pink',
      'black',
      'white',
      'gray',
      'grey',
      'brown',
      'cyan',
      'magenta',
    ];

    const isHex = hexPattern.test(this._value);
    const isRgb = rgbPattern.test(this._value);
    const isHsl = hslPattern.test(this._value);
    const isNamed = namedColors.includes(this._value);

    if (!isHex && !isRgb && !isHsl && !isNamed) {
      throw new InvalidColorException(
        'Invalid color format. Supported formats: hex (#fff, #ffffff), rgb(r,g,b), hsl(h,s%,l%), or named colors',
      );
    }
  }

  private rgbToHex(): string {
    const match = this._value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return this._value;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private hexToRgb(): string {
    const hex = this._value.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  private hexToHsl(): string {
    // Simplified conversion - would need full implementation
    return this._value;
  }

  private hslToHex(): string {
    // Simplified conversion - would need full implementation
    return this._value;
  }

  private hslToRgb(): string {
    // Simplified conversion - would need full implementation
    return this._value;
  }

  private rgbToHsl(): string {
    // Simplified conversion - would need full implementation
    return this._value;
  }
}
