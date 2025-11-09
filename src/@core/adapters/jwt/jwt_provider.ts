import * as jwt from 'jsonwebtoken';

import { JwtSigner } from 'src/@core/application/ports/jwt/jwt_signer.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import {
  JwtVerifier,
  JwtVerifyOutput,
} from 'src/@core/application/ports/jwt/jwt_verifier.port';
import { ExpiredTokenError } from 'src/@core/application/errors/expired_token.error';
import { TokenVerificationError } from 'src/@core/application/errors/token_verification.error';

export class JwtProvider implements JwtSigner, JwtVerifier {
  private readonly _secret: string;

  constructor(private readonly confProvider: ConfProvider) {
    this._secret = this.confProvider.get('auth.secret');
  }

  async sign(
    payload: Record<string, unknown>,
    ttl: TimeDuration,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this._secret,
        {
          algorithm: 'HS256',
          expiresIn: ttl,
        },
        (err, token) => {
          if (err) reject(err);
          if (token) resolve(token);
        },
      );
    });
  }

  async verify<T = Record<string, unknown>>(
    token: string,
  ): Promise<JwtVerifyOutput<T>> {
    return new Promise((resolve) => {
      jwt.verify(
        token,
        this._secret,
        { algorithms: ['HS256'] },
        (err, decoded) => {
          if (err) {
            if (err instanceof jwt.TokenExpiredError) {
              return resolve({
                data: null,
                error: new ExpiredTokenError({ cause: err }),
              });
            }

            return resolve({
              data: null,
              error: new TokenVerificationError({ cause: err }),
            });
          }
          if (decoded)
            resolve({
              data: decoded as T,
              error: null,
            });
        },
      );
    });
  }
}
