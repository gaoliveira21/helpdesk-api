import { Hour } from './hour.vo';

describe('Hour Value Object', () => {
  it('should create an Hour with a valid value', () => {
    const hour = new Hour(10);
    expect(hour.value).toBe(10);
    expect(hour.toString()).toBe('10:00');
  });

  it('should throw an error for invalid hour values', () => {
    expect(() => new Hour(-1)).toThrow('Hour must be between 0 and 23');
    expect(() => new Hour(24)).toThrow('Hour must be between 0 and 23');
  });

  it('should compare two Hour instances correctly', () => {
    const hour1 = new Hour(15);
    const hour2 = new Hour(15);
    const hour3 = new Hour(16);

    expect(hour1.isEqual(hour2)).toBe(true);
    expect(hour1.isEqual(hour3)).toBe(false);
  });

  it('should format single-digit hours correctly', () => {
    const hour = new Hour(5);
    expect(hour.toString()).toBe('05:00');
  });
});
