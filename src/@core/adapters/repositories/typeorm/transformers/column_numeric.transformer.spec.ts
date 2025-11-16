import { ColumnNumericTransformer } from './column_numeric.transformer';

describe('TypeORMColumnNumericTransformer', () => {
  let transformer: ColumnNumericTransformer;

  beforeEach(() => {
    transformer = new ColumnNumericTransformer();
  });

  describe('to', () => {
    it('should return the same number', () => {
      const input = 123.45;
      const result = transformer.to(input);
      expect(result).toBe(input);
    });
  });

  describe('from', () => {
    it('should convert string to number', () => {
      const input = '123.45';
      const result = transformer.from(input);
      expect(result).toBe(123.45);
    });

    it('should handle integer strings', () => {
      const input = '100';
      const result = transformer.from(input);
      expect(result).toBe(100);
    });

    it('should handle negative numbers', () => {
      const input = '-50.5';
      const result = transformer.from(input);
      expect(result).toBe(-50.5);
    });
  });
});
