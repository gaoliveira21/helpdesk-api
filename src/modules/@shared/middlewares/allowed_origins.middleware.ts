import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';

@Injectable()
export class AllowedOriginMiddleware implements NestMiddleware {
  private readonly allowedOrigins: string[];

  constructor(
    @Inject(ConfProvider)
    private readonly confProvider: ConfProvider,
  ) {
    this.allowedOrigins = this.confProvider.get('allowedOrigins');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    const referer = req.headers.referer?.replace(/\/$/, ''); // Remove trailing slash if present

    if (!origin && !referer) return next();

    const isOriginAllowed = origin && this.allowedOrigins.includes(origin);
    const isRefererAllowed =
      referer &&
      this.allowedOrigins.some((allowedOrigin) =>
        referer.startsWith(allowedOrigin),
      );

    if (!isOriginAllowed || !isRefererAllowed) {
      return res.status(403).json({ message: 'Origin not allowed' });
    }

    next();
  }
}
