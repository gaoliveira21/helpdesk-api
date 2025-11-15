import { Time } from './time.vo';

describe('Time Value Object', () => {
  it('should create Time from milliseconds', () => {
    const time = new Time(60000);
    expect(time.value).toBe(60000);
  });

  it.each<{ duration: TimeDuration; expectedMs: number }>([
    { duration: '1w', expectedMs: 7 * 24 * 60 * 60 * 1000 },
    { duration: '2d', expectedMs: 2 * 24 * 60 * 60 * 1000 },
    { duration: '3h', expectedMs: 3 * 60 * 60 * 1000 },
    { duration: '15min', expectedMs: 15 * 60 * 1000 },
  ])('should create Time from TimeDuration', ({ duration, expectedMs }) => {
    const time = Time.fromTimeDuration(duration);
    expect(time.value).toBe(expectedMs);
  });

  it('should compare two Time objects for equality', () => {
    const time1 = new Time(300000);
    const time2 = new Time(300000);
    const time3 = new Time(600000);
    expect(time1.isEqual(time2)).toBe(true);
    expect(time1.isEqual(time3)).toBe(false);
  });

  it('should add Time to a Date object', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const time = new Time(60000); // 1 minute
    const newDate = time.addTimeToDate(date);
    expect(newDate.toISOString()).toBe('2024-01-01T00:01:00.000Z');
  });

  it('should add Time to a timestamp', () => {
    const timestamp = new Date('2024-01-01T00:00:00Z').getTime();
    const time = new Time(120000); // 2 minutes
    const newDate = time.addTimeToDate(timestamp);
    expect(newDate.toISOString()).toBe('2024-01-01T00:02:00.000Z');
  });

  it('should convert Time to string', () => {
    const time = new Time(45000);
    expect(time.toString()).toBe('45000ms');
  });
});
