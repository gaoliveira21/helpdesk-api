import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw an error for invalid email', () => {
    expect(() => new Email('invalid-email')).toThrow('Invalid email format');
  });

  it('should validate email format', () => {
    expect(Email.validate('test@example.com')).toBe(true);
    expect(Email.validate('invalid-email')).toBe(false);
  });

  it('should compare two email value objects', () => {
    const email1 = new Email('test@example.com');
    const email2 = new Email('test@example.com');
    const email3 = new Email('test2@example.com');

    expect(email1.isEqual(email2)).toBe(true);
    expect(email1.isEqual(email3)).toBe(false);
  });

  it('should return string representation of the email', () => {
    const email = new Email('test@example.com');
    expect(email.toString()).toBe('test@example.com');
  });
});
