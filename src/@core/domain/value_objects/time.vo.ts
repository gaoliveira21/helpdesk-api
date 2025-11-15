import { ValueObject } from './value_object.interface';

export class Time implements ValueObject<number> {
  private readonly _value: number;

  constructor(value: number) {
    this._value = value;
  }

  static fromTimeDuration(duration: TimeDuration): Time {
    return new Time(Time.convertTimeDurationToMs(duration));
  }

  get value(): number {
    return this._value;
  }

  isEqual(other: Time): boolean {
    return this._value === other._value;
  }

  addTimeToDate(date: Date | number): Date {
    return new Date(
      (date instanceof Date ? date.getTime() : date) + this._value,
    );
  }

  toString(): string {
    return `${this._value}ms`;
  }

  private static convertTimeDurationToMs(ttl: TimeDuration): number {
    const unit = ttl.replace(/\d+/g, '').toLowerCase();
    const value = Number(ttl.replace(/\D+/g, ''));

    switch (unit) {
      case 'w':
        return value * 7 * 24 * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'min':
        return value * 60 * 1000;
      default:
        throw new Error(`Invalid time unit: ${unit}`);
    }
  }
}
