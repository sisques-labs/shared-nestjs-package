import { InvalidColorException } from '@/shared/domain/exceptions/value-objects/invalid-color/invalid-color.exception';
import { ValueObject } from '@/shared/domain/value-objects/base/value-object.base';

/**
 * Represents a color value object supporting hex, RGB, HSL, and named color formats.
 *
 * Validates and encapsulates color values for DDD-style domains.
 *
 * @remarks
 * - Supported formats: Hex (e.g., `#fff`, `#ffffff`), RGB (e.g., `rgb(255,255,255)`), HSL (e.g., `hsl(0,0%,100%)`), and common named colors.
 * - Throws {@link InvalidColorException} on invalid or empty values.
 *
 * @example
 * ```typescript
 * const color = new ColorValueObject('#ff00ff');
 * color.toRgb(); // "rgb(255, 0, 255)"
 * ```
 *
 * @public
 */
export class ColorValueObject extends ValueObject<string> {
  /**
   * The normalized string value for the color.
   * Stored in lowercase and trimmed.
   * @internal
   */
  private readonly _value: string;

  /**
   * Constructs a new {@link ColorValueObject}.
   *
   * @param value - The input color; must be hex, rgb, hsl, or a named color.
   *
   * @throws {@link InvalidColorException} If empty or invalid format.
   */
  constructor(value: string) {
    super();
    this._value = (value ?? '').trim().toLowerCase();
    this.validate();
  }

  /**
   * Gets the underlying color string value.
   *
   * @returns The normalized color string.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Returns the color represented in hex format.
   *
   * @returns The color string in hex (e.g. `#ff00ff`), or itself if already named.
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
    return this._value; // Named color, returned as-is.
  }

  /**
   * Returns the color represented in RGB format.
   *
   * @returns The color string in RGB (e.g. `rgb(255, 0, 255)`), or itself if already named.
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
    return this._value; // Named color, returned as-is.
  }

  /**
   * Returns the color represented in HSL format.
   *
   * @returns The color string in HSL (e.g. `hsl(300, 100%, 50%)`), or itself if already named.
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
    return this._value; // Named color, returned as-is.
  }

  /**
   * Determines if the color is in valid hex format.
   *
   * @returns `true` if color matches hex pattern; otherwise `false`.
   */
  public isHex(): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this._value);
  }

  /**
   * Determines if the color is in valid RGB format.
   *
   * @returns `true` if color matches RGB pattern; otherwise `false`.
   */
  public isRgb(): boolean {
    return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(this._value);
  }

  /**
   * Determines if the color is in valid HSL format.
   *
   * @returns `true` if color matches HSL pattern; otherwise `false`.
   */
  public isHsl(): boolean {
    return /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(this._value);
  }

  /**
   * Validates the encapsulated color.
   *
   * @throws {@link InvalidColorException} If the color is missing or has an unsupported format.
   * @protected
   */
  protected validate(): void {
    this.checkIsEmpty();
    this.checkIsValidColor();
  }

  /**
   * Throws if the color string is empty.
   *
   * @throws {@link InvalidColorException}
   * @private
   */
  private checkIsEmpty(): void {
    if (!this._value || this._value.trim() === '') {
      throw new InvalidColorException('Color cannot be empty');
    }
  }

  /**
   * Throws if the color format is invalid.
   *
   * @throws {@link InvalidColorException}
   * @private
   */
  private checkIsValidColor(): void {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const hslPattern = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;

    // A basic set of supported named colors.
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

  /**
   * Converts an RGB color string to a hex color string.
   *
   * @returns Hex string (e.g. `#ff00ff`), or the original value on parse failure.
   * @private
   */
  private rgbToHex(): string {
    const match = this._value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return this._value;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Converts a hex color string to an RGB color string.
   *
   * @returns RGB string (e.g. `rgb(255, 0, 255)`).
   * @private
   */
  private hexToRgb(): string {
    const hex = this._value.replace('#', '');

    // Hex string must be exactly 6 characters for conversion.
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Stub: Converts a hex color string to an HSL color string.
   *
   * @remarks
   * Not implemented. Returns the original value for now.
   * @returns Original value.
   * @private
   */
  private hexToHsl(): string {
    return this._value;
  }

  /**
   * Stub: Converts an HSL color string to a hex color string.
   *
   * @remarks
   * Not implemented. Returns the original value for now.
   * @returns Original value.
   * @private
   */
  private hslToHex(): string {
    return this._value;
  }

  /**
   * Stub: Converts an HSL color string to an RGB color string.
   *
   * @remarks
   * Not implemented. Returns the original value for now.
   * @returns Original value.
   * @private
   */
  private hslToRgb(): string {
    return this._value;
  }

  /**
   * Stub: Converts an RGB color string to an HSL color string.
   *
   * @remarks
   * Not implemented. Returns the original value for now.
   * @returns Original value.
   * @private
   */
  private rgbToHsl(): string {
    return this._value;
  }
}
