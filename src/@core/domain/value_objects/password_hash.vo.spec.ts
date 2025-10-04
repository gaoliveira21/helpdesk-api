import { PasswordHash } from './password_hash.vo';

describe('PasswordHash Value Object', () => {
  it('should throw an error for passwords shorter than 6 characters', async () => {
    await expect(PasswordHash.create('123')).rejects.toThrow(
      'Password must be at least 6 characters long',
    );
  });

  it('should create a PasswordHash from plain text', async () => {
    const plainText = 'mySecurePassword';
    const passwordHash = await PasswordHash.create(plainText);

    expect(passwordHash).toBeInstanceOf(PasswordHash);
    expect(passwordHash.value.length).toBeGreaterThan(plainText.length);
    expect(passwordHash.value).not.toBe(plainText);
  });

  it('should create a PasswordHash from an existing hash', async () => {
    const plainText = 'mySecurePassword';
    const existingHash = await PasswordHash.create(plainText);
    const passwordHash = PasswordHash.fromHash(existingHash.value);

    expect(passwordHash).toBeInstanceOf(PasswordHash);
    expect(passwordHash.value).toBe(existingHash.value);
  });

  it('should compare plain text with the hash correctly', async () => {
    const plainText = 'mySecurePassword';
    const wrongText = 'wrongPassword';
    const passwordHash = await PasswordHash.create(plainText);

    const isMatch = await passwordHash.compare(plainText);
    const isNotMatch = await passwordHash.compare(wrongText);

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should return the correct string representation', async () => {
    const plainText = 'mySecurePassword';
    const passwordHash = await PasswordHash.create(plainText);

    expect(passwordHash.toString()).toBe(passwordHash.value);
  });

  it('should check equality between two PasswordHash instances', async () => {
    const plainText = 'mySecurePassword';
    const passwordHash1 = await PasswordHash.create(plainText);
    const passwordHash2 = PasswordHash.fromHash(passwordHash1.value);
    const passwordHash3 = await PasswordHash.create('anotherPassword');

    expect(passwordHash1.isEqual(passwordHash2)).toBe(true);
    expect(passwordHash1.isEqual(passwordHash3)).toBe(false);
  });
});
