import * as jwt from 'jsonwebtoken';

import { JwtSigner } from 'src/@core/application/ports/jwt_signer.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';

import { TokenVerificationError } from './errors/token_verification.error';
import { ExpiredTokenError } from './errors/expired_token.error';

export class JwtProvider implements JwtSigner {
  private readonly _secret: string;

  constructor(private readonly confProvider: ConfProvider) {
    this._secret = this.confProvider.get('auth.secret');
  }

  async sign(
    payload: Record<string, unknown>,
    ttlInMs: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this._secret,
        {
          algorithm: 'HS256',
          expiresIn: Math.floor(ttlInMs / 1000),
        },
        (err, token) => {
          if (err) reject(err);
          if (token) resolve(token);
        },
      );
    });
  }

  async verify<T = Record<string, unknown>>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this._secret,
        { algorithms: ['HS256'] },
        (err, decoded) => {
          if (err) {
            if (err instanceof jwt.TokenExpiredError) {
              return reject(new ExpiredTokenError({ cause: err }));
            }

            return reject(new TokenVerificationError({ cause: err }));
          }
          if (decoded) resolve(decoded as T);
        },
      );
    });
  }
}
