import { AppConfProvider } from '../conf/app_conf_provider';
import { CsrfProvider } from './csrf_provider';

describe('CsrfProvider', () => {
  it('should generate a CSRF token', async () => {
    const confProvider = new AppConfProvider();
    const generator = new CsrfProvider(confProvider);
    const token = generator.generate();

    expect(token.length).toBeGreaterThan(0);
  });

  it('should verify a valid CSRF token', async () => {
    const confProvider = new AppConfProvider();
    const generator = new CsrfProvider(confProvider);
    const token = generator.generate();

    const isValid = generator.verify(token);
    expect(isValid).toBe(true);
  });

  it('should not verify an invalid CSRF token', async () => {
    const confProvider = new AppConfProvider();
    const generator = new CsrfProvider(confProvider);
    const invalidToken = 'invalid_token';

    const isValid = generator.verify(invalidToken);
    expect(isValid).toBe(false);
  });
});
