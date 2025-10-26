import { AppConfProvider } from './app_conf_provider';

describe('AppConfProvider', () => {
  it('should load configuration from environment variables', () => {
    const confProvider = new AppConfProvider();

    expect(confProvider.get('auth.secret')).toBe(process.env.JWT_SECRET);
    expect(confProvider.get('auth.accessTokenExpiresIn')).toBe(
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    );
    expect(confProvider.get('auth.refreshTokenExpiresIn')).toBe(
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    );
    expect(confProvider.get('auth')).toEqual({
      secret: process.env.JWT_SECRET,
      accessTokenExpiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
      refreshTokenExpiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    });
  });

  it('should throw an error if configuration is invalid', () => {
    process.env.JWT_SECRET = '';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '0';
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '0';

    expect(() => new AppConfProvider()).toThrow(/Invalid configuration:/);
  });
});
