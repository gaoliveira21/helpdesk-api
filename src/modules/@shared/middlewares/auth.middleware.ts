import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ValidateAuthenticatedUser } from 'src/@core/application/usecases/validate_authenticated_user';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly validateAuthenticatedUser: ValidateAuthenticatedUser,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'] as string | undefined;
    if (!accessToken) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const { data, error } = await this.validateAuthenticatedUser.execute({
      accessToken,
    });
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      id: data.userId,
      email: data.email,
      role: data.role,
    };

    next();
  }
}
