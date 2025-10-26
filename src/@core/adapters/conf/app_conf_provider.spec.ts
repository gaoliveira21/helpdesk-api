import { AppConfProvider } from './app_conf_provider';

describe('AppConfProvider', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'mysecretkey';
    process.env.JWT_EXPIRES_IN = '3600';
  });

  it('should load configuration from environment variables', () => {
    const confProvider = new AppConfProvider();

    expect(confProvider.get('auth.jwtSecret')).toBe('mysecretkey');
    expect(confProvider.get('auth.jwtExpiresIn')).toBe(3600);
    expect(confProvider.get('auth')).toEqual({
      jwtSecret: 'mysecretkey',
      jwtExpiresIn: 3600,
    });
  });

  it('should throw an error if configuration is invalid', () => {
    process.env.JWT_SECRET = '';
    process.env.JWT_EXPIRES_IN = '0';

    expect(() => new AppConfProvider()).toThrow(/Invalid configuration:/);
  });
});
