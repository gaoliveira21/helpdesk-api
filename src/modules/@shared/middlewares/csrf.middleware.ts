import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CsrfVerifier } from 'src/@core/application/ports/csrf/csrf_verifier.port';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(
    @Inject(CsrfVerifier)
    private readonly csrfVerifier: CsrfVerifier,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const csrfTokenCookie = req.cookies['csrfToken'] as string | undefined;
    if (!csrfTokenCookie) {
      return res.status(403).json({ message: 'CSRF token not provided' });
    }

    const csrfTokenHeader = req.headers['x-csrf-token'] as string | undefined;
    if (!csrfTokenHeader) {
      return res.status(403).json({ message: 'CSRF token not provided' });
    }

    if (csrfTokenCookie !== csrfTokenHeader) {
      return res.status(403).json({ message: 'CSRF token mismatch' });
    }

    const isValid = this.csrfVerifier.verify(csrfTokenHeader);
    if (!isValid) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    next();
  }
}
