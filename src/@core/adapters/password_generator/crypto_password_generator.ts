import crypto from 'node:crypto';

import { PasswordGenerator } from 'src/@core/application/ports/password_generator.port';

export class CryptoPasswordGenerator implements PasswordGenerator {
  private readonly CHARSET =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';

  generate(len: number = 12): string {
    return Array.from(crypto.getRandomValues(new Uint32Array(len)))
      .map((x) => this.CHARSET[x % this.CHARSET.length])
      .join('');
  }
}
