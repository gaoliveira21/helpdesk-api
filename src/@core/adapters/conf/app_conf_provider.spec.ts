import { AppConfProvider } from './app_conf_provider';

describe('AppConfProvider', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'mysecretkey';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '3600';
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '7200';
  });

  it('should load configuration from environment variables', () => {
    const confProvider = new AppConfProvider();

    expect(confProvider.get('auth.secret')).toBe('mysecretkey');
    expect(confProvider.get('auth.accessTokenExpiresIn')).toBe(3600);
    expect(confProvider.get('auth.refreshTokenExpiresIn')).toBe(7200);
    expect(confProvider.get('auth')).toEqual({
      secret: 'mysecretkey',
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 7200,
    });
  });

  it('should throw an error if configuration is invalid', () => {
    process.env.JWT_SECRET = '';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '0';
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '0';

    expect(() => new AppConfProvider()).toThrow(/Invalid configuration:/);
  });
});
