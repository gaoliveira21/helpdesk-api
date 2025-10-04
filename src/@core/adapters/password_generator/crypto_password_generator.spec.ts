import { CryptoPasswordGenerator } from './crypto_password_generator';

describe('CryptoPasswordGenerator', () => {
  it('should generate a password with default length', () => {
    const generator = new CryptoPasswordGenerator();
    const password = generator.generate();
    expect(password).toHaveLength(12);
  });

  it('should generate a password with specified length', () => {
    const generator = new CryptoPasswordGenerator();
    const password = generator.generate(16);
    expect(password).toHaveLength(16);
  });
});
