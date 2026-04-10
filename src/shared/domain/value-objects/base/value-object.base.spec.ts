import { ValueObject } from './value-object.base';

class TestStringVO extends ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = value;
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  protected validate(): void {
    if (!this._value) throw new Error('Value cannot be empty');
  }
}

class TestObjectVO extends ValueObject<{ x: number; y: number }> {
  private readonly _value: { x: number; y: number };

  constructor(x: number, y: number) {
    super();
    this._value = { x, y };
    this.validate();
  }

  get value() {
    return this._value;
  }

  protected validate(): void {}
}

describe('ValueObject', () => {
  describe('equals', () => {
    it('returns true for same primitive value', () => {
      expect(new TestStringVO('hello').equals(new TestStringVO('hello'))).toBe(true);
    });

    it('returns false for different primitive value', () => {
      expect(new TestStringVO('hello').equals(new TestStringVO('world'))).toBe(false);
    });

    it('returns true for same object value', () => {
      expect(new TestObjectVO(1, 2).equals(new TestObjectVO(1, 2))).toBe(true);
    });

    it('returns false for different object value', () => {
      expect(new TestObjectVO(1, 2).equals(new TestObjectVO(1, 3))).toBe(false);
    });
  });

  describe('toPrimitives', () => {
    it('returns the raw value for primitives', () => {
      expect(new TestStringVO('hello').toPrimitives()).toBe('hello');
    });

    it('returns a deep copy for objects', () => {
      const vo = new TestObjectVO(1, 2);
      const primitives = vo.toPrimitives();
      expect(primitives).toEqual({ x: 1, y: 2 });
      expect(primitives).not.toBe(vo.value);
    });
  });

  describe('toString', () => {
    it('returns string representation', () => {
      expect(new TestStringVO('hello').toString()).toBe('hello');
    });

    it('returns JSON for objects', () => {
      expect(new TestObjectVO(1, 2).toString()).toBe('{"x":1,"y":2}');
    });
  });

  describe('isDefined', () => {
    it('returns true for defined values', () => {
      expect(new TestStringVO('hello').isDefined()).toBe(true);
    });
  });

  describe('isNullOrUndefined', () => {
    it('returns false for defined values', () => {
      expect(new TestStringVO('hello').isNullOrUndefined()).toBe(false);
    });
  });

  describe('validate enforcement', () => {
    it('throws when validation fails', () => {
      expect(() => new TestStringVO('')).toThrow('Value cannot be empty');
    });
  });
});
