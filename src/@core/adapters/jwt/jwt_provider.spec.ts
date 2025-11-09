import { TokenVerificationError } from 'src/@core/application/errors/token_verification.error';
import { ExpiredTokenError } from 'src/@core/application/errors/expired_token.error';

import { AppConfProvider } from '../conf/app_conf_provider';
import { JwtProvider } from './jwt_provider';

describe('JwtProvider', () => {
  const createJwtProvider = () => {
    const confProvider = new AppConfProvider();
    const jwtProvider = new JwtProvider(confProvider);
    return jwtProvider;
  };

  it('should sign and verify a token correctly', async () => {
    const jwtProvider = createJwtProvider();
    const payload = { userId: '12345' };

    const token = await jwtProvider.sign(payload, '1min');
    expect(token).toBeDefined();

    const { data, error } = await jwtProvider.verify<{ userId: string }>(token);
    expect(error).toBeNull();
    expect(data?.userId).toBe(payload.userId);
  });

  it('should throw an TokenVerificationError for an invalid token', async () => {
    const jwtProvider = createJwtProvider();
    const invalidToken = 'invalid.token.here';

    const { data, error } = await jwtProvider.verify(invalidToken);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(TokenVerificationError);
  });

  it('should throw an ExpiredTokenError for an expired token', async () => {
    const jwtProvider = createJwtProvider();
    const payload = { userId: '12345' };

    const token = await jwtProvider.sign(payload, '0min');

    const { data, error } = await jwtProvider.verify(token);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(ExpiredTokenError);
  });
});
