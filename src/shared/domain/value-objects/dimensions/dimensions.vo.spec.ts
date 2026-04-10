import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { InvalidDimensionsException } from '@/shared/domain/exceptions/value-objects/invalid-dimensions/invalid-dimensions.exception';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';

const validInput = () => ({
  length: 10,
  width: 5,
  height: 3,
  unit: LengthUnitEnum.CENTIMETER,
});

describe('DimensionsValueObject', () => {
  describe('constructor', () => {
    it('should create with valid numeric dimensions', () => {
      const d = new DimensionsValueObject(validInput());

      expect(d.length).toBe(10);
      expect(d.width).toBe(5);
      expect(d.height).toBe(3);
      expect(d.unit.value).toBe(LengthUnitEnum.CENTIMETER);
    });

    it('should parse string dimensions', () => {
      const d = new DimensionsValueObject({
        length: '10.5',
        width: '2',
        height: '1',
        unit: LengthUnitEnum.METER,
      });

      expect(d.length).toBe(10.5);
      expect(d.width).toBe(2);
      expect(d.height).toBe(1);
    });

    it('should throw InvalidDimensionsException when length is missing', () => {
      expect(
        () =>
          new DimensionsValueObject({
            length: undefined as unknown as number,
            width: 1,
            height: 1,
            unit: LengthUnitEnum.METER,
          }),
      ).toThrow(InvalidDimensionsException);
      expect(
        () =>
          new DimensionsValueObject({
            length: undefined as unknown as number,
            width: 1,
            height: 1,
            unit: LengthUnitEnum.METER,
          }),
      ).toThrow('Length is required');
    });

    it('should throw InvalidDimensionsException when width is missing', () => {
      expect(
        () =>
          new DimensionsValueObject({
            length: 1,
            width: undefined as unknown as number,
            height: 1,
            unit: LengthUnitEnum.METER,
          }),
      ).toThrow('Width is required');
    });

    it('should throw InvalidDimensionsException when height is missing', () => {
      expect(
        () =>
          new DimensionsValueObject({
            length: 1,
            width: 1,
            height: undefined as unknown as number,
            unit: LengthUnitEnum.METER,
          }),
      ).toThrow('Height is required');
    });

    it('should throw InvalidDimensionsException when unit is empty', () => {
      expect(
        () =>
          new DimensionsValueObject({
            length: 1,
            width: 1,
            height: 1,
            unit: '   ',
          }),
      ).toThrow('Unit is required');
    });

    it('should throw InvalidEnumValueException for invalid unit', () => {
      expect(
        () =>
          new DimensionsValueObject({
            ...validInput(),
            unit: 'PARSEC',
          }),
      ).toThrow(InvalidEnumValueException);
    });

    it('should throw for invalid dimension string', () => {
      expect(
        () =>
          new DimensionsValueObject({
            ...validInput(),
            length: 'not-a-number',
          }),
      ).toThrow(InvalidDimensionsException);
      expect(
        () =>
          new DimensionsValueObject({
            ...validInput(),
            length: 'not-a-number',
          }),
      ).toThrow('Invalid length format: not-a-number');
    });

    it('should throw when dimension is not finite', () => {
      expect(
        () =>
          new DimensionsValueObject({
            ...validInput(),
            length: Infinity,
          }),
      ).toThrow(InvalidDimensionsException);
      expect(
        () =>
          new DimensionsValueObject({
            ...validInput(),
            width: NaN,
          }),
      ).toThrow(InvalidDimensionsException);
    });

    it('should throw when any dimension is zero or negative', () => {
      expect(() => new DimensionsValueObject({ ...validInput(), length: 0 })).toThrow(
        'length must be greater than 0',
      );
      expect(() => new DimensionsValueObject({ ...validInput(), width: -1 })).toThrow(
        'width must be greater than 0',
      );
      expect(() => new DimensionsValueObject({ ...validInput(), height: -0.1 })).toThrow(
        'height must be greater than 0',
      );
    });

    it('should enforce min option', () => {
      expect(
        () => new DimensionsValueObject(validInput(), { min: 20 }),
      ).toThrow('length must be at least 20');
    });

    it('should enforce max option', () => {
      expect(
        () => new DimensionsValueObject(validInput(), { max: 4 }),
      ).toThrow('length must be at most 4');
    });

    it('should throw when allowDecimals is false and value is not integer', () => {
      expect(
        () =>
          new DimensionsValueObject(
            { length: 10.5, width: 5, height: 3, unit: LengthUnitEnum.CENTIMETER },
            { allowDecimals: false },
          ),
      ).toThrow('length must be an integer');
    });

    it('should throw when precision is exceeded', () => {
      expect(
        () =>
          new DimensionsValueObject(
            { length: 10.123, width: 5, height: 3, unit: LengthUnitEnum.CENTIMETER },
            { precision: 2 },
          ),
      ).toThrow('length cannot have more than 2 decimal places');
    });
  });

  describe('value and toPrimitives', () => {
    it('should expose value object shape', () => {
      const d = new DimensionsValueObject(validInput());

      expect(d.value).toEqual({
        length: 10,
        width: 5,
        height: 3,
        unit: LengthUnitEnum.CENTIMETER,
      });
    });

    it('should return same shape from toPrimitives', () => {
      const d = new DimensionsValueObject(validInput());

      expect(d.toPrimitives()).toEqual(d.value);
    });
  });

  describe('geometry helpers', () => {
    it('should compute volume, base area, surface and lateral surface', () => {
      const d = new DimensionsValueObject({ length: 10, width: 5, height: 3, unit: LengthUnitEnum.CENTIMETER });

      expect(d.getVolume()).toBe(150);
      expect(d.getBaseArea()).toBe(50);
      expect(d.getSurfaceArea()).toBe(190);
      expect(d.getLateralSurfaceArea()).toBe(90);
    });

    it('should return longest and shortest dimension', () => {
      const d = new DimensionsValueObject(validInput());

      expect(d.getLongestDimension()).toBe(10);
      expect(d.getShortestDimension()).toBe(3);
    });

    it('should detect cube', () => {
      expect(
        new DimensionsValueObject({
          length: 2,
          width: 2,
          height: 2,
          unit: LengthUnitEnum.METER,
        }).isCube(),
      ).toBe(true);

      expect(new DimensionsValueObject(validInput()).isCube()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true when all dimensions and unit match', () => {
      const a = new DimensionsValueObject(validInput());
      const b = new DimensionsValueObject(validInput());

      expect(a.equals(b)).toBe(true);
    });

    it('should return false when a dimension differs', () => {
      const a = new DimensionsValueObject(validInput());
      const b = new DimensionsValueObject({ ...validInput(), height: 4 });

      expect(a.equals(b)).toBe(false);
    });

    it('should return false when unit differs', () => {
      const a = new DimensionsValueObject(validInput());
      const b = new DimensionsValueObject({
        ...validInput(),
        unit: LengthUnitEnum.METER,
      });

      expect(a.equals(b)).toBe(false);
    });
  });

  describe('fromNullable', () => {
    it('should return null when any field is missing', () => {
      expect(
        DimensionsValueObject.fromNullable({
          length: 1,
          width: 1,
          height: 1,
          unit: null,
        }),
      ).toBeNull();

      expect(
        DimensionsValueObject.fromNullable({
          length: undefined,
          width: 1,
          height: 1,
          unit: LengthUnitEnum.METER,
        }),
      ).toBeNull();

      expect(
        DimensionsValueObject.fromNullable({
          length: 1,
          width: 1,
          height: undefined,
          unit: LengthUnitEnum.METER,
        }),
      ).toBeNull();
    });

    it('should return null when unit is blank', () => {
      expect(
        DimensionsValueObject.fromNullable({
          length: 1,
          width: 1,
          height: 1,
          unit: '  ',
        }),
      ).toBeNull();
    });

    it('should return instance when all fields are present', () => {
      const d = DimensionsValueObject.fromNullable({
        length: 2,
        width: 3,
        height: 4,
        unit: LengthUnitEnum.INCH,
      });

      expect(d).not.toBeNull();
      expect(d!.length).toBe(2);
      expect(d!.unit.value).toBe(LengthUnitEnum.INCH);
    });

    it('should forward validation options', () => {
      const d = DimensionsValueObject.fromNullable(
        { length: 1, width: 1, height: 1, unit: LengthUnitEnum.METER },
        { min: 0.5, max: 10 },
      );

      expect(d).not.toBeNull();
    });

    it('should throw when throwOnInvalid is true and fields are missing', () => {
      expect(() =>
        DimensionsValueObject.fromNullable(
          {
            length: null,
            width: 1,
            height: 1,
            unit: LengthUnitEnum.METER,
          },
          { throwOnInvalid: true },
        ),
      ).toThrow(InvalidDimensionsException);

      expect(() =>
        DimensionsValueObject.fromNullable(
          {
            length: null,
            width: 1,
            height: 1,
            unit: LengthUnitEnum.METER,
          },
          { throwOnInvalid: true },
        ),
      ).toThrow('Missing required fields: length');
    });

    it('should list all missing fields when throwOnInvalid is true', () => {
      expect(() =>
        DimensionsValueObject.fromNullable(
          {
            length: undefined,
            width: undefined,
            height: undefined,
            unit: '',
          },
          { throwOnInvalid: true },
        ),
      ).toThrow('Missing required fields: length, width, height, unit');
    });
  });
});
