import { AppConfProvider } from './app_conf_provider';

describe('AppConfProvider', () => {
  it('should load configuration from environment variables', () => {
    const confProvider = new AppConfProvider();

    expect(confProvider.get('auth.secret')).toBe(process.env.JWT_SECRET);
    expect(confProvider.get('auth.accessTokenExpiresIn')).toBe(
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    );
    expect(confProvider.get('auth.refreshTokenExpiresIn')).toBe(
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    );
    expect(confProvider.get('auth')).toEqual({
      secret: process.env.JWT_SECRET,
      accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
    expect(confProvider.get('allowedOrigins')).toHaveLength(2);
  });

  it('should throw an error if configuration is invalid', () => {
    process.env.JWT_SECRET = '';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '0';
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '0';

    expect(() => new AppConfProvider()).toThrow(/Invalid configuration:/);
  });
});
