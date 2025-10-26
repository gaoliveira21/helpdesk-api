import { TokenVerificationError } from './errors/token_verification.error';
import { JwtProvider } from './jwt_provider';
import { ExpiredTokenError } from './errors/expired_token.error';

describe('JwtProvider', () => {
  it('should sign and verify a token correctly', async () => {
    const jwtProvider = new JwtProvider();
    const payload = { userId: '12345' };
    const ttlInMs = 60000; // 1 minute

    const token = await jwtProvider.sign(payload, ttlInMs);
    expect(token).toBeDefined();

    const decoded = await jwtProvider.verify<{ userId: string }>(token);
    expect(decoded.userId).toBe(payload.userId);
  });

  it('should throw an TokenVerificationError for an invalid token', async () => {
    const jwtProvider = new JwtProvider();
    const invalidToken = 'invalid.token.here';

    await expect(jwtProvider.verify(invalidToken)).rejects.toThrow(
      TokenVerificationError,
    );
  });

  it('should throw an ExpiredTokenError for an expired token', async () => {
    const jwtProvider = new JwtProvider();
    const payload = { userId: '12345' };
    const ttlInMs = -1000; // 1 second

    const token = await jwtProvider.sign(payload, ttlInMs);
    expect(token).toBeDefined();

    await expect(jwtProvider.verify(token)).rejects.toThrow(ExpiredTokenError);
  });
});
