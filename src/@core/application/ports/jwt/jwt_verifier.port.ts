import { ExpiredTokenError } from 'src/@core/application/errors/expired_token.error';
import { TokenVerificationError } from 'src/@core/application/errors/token_verification.error';

export type JwtVerifyOutput<T> =
  | {
      error: null;
      data: T;
    }
  | { error: ExpiredTokenError | TokenVerificationError; data: null };

export interface JwtVerifier {
  verify<T = Record<string, unknown>>(
    token: string,
  ): Promise<JwtVerifyOutput<T>>;
}

export const JwtVerifier = Symbol('JwtVerifier');
