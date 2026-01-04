import csrf from 'csrf';

import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { CsrfGenerator } from 'src/@core/application/ports/csrf/csrf_generator.port';
import { CsrfVerifier } from 'src/@core/application/ports/csrf/csrf_verifier.port';

export class CsrfProvider implements CsrfGenerator, CsrfVerifier {
  private readonly _secret: string;
  private readonly _tokens: csrf;

  constructor(private readonly confProvider: ConfProvider) {
    this._secret = this.confProvider.get('csrf.secret');
    this._tokens = new csrf();
  }

  generate(): string {
    return this._tokens.create(this._secret);
  }

  verify(token: string): boolean {
    return this._tokens.verify(this._secret, token);
  }
}
