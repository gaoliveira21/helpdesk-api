import { Price } from './price.vo';

describe('Price Value Object', () => {
  it('should create a Price instance with a valid positive number', () => {
    const price = new Price(100);
    expect(price.value).toBe(100);
    expect(price.toString()).toBe('R$ 100,00');
  });

  it('should throw an error when trying to create a Price with a negative number', () => {
    expect(() => new Price(-50)).toThrow('Price must be a positive number');
  });

  it('should correctly compare two Price instances for equality', () => {
    const price1 = new Price(200);
    const price2 = new Price(200);
    const price3 = new Price(300);

    expect(price1.isEqual(price2)).toBe(true);
    expect(price1.isEqual(price3)).toBe(false);
  });

  it('should format the price correctly in Brazilian Real currency format', () => {
    const price = new Price(1234.56);
    expect(price.toString()).toBe('R$ 1.234,56');
  });
});
