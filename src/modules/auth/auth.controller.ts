import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';

import { InvalidCredentialsError } from 'src/@core/application/errors/invalid_credentials.error';
import { Authenticate } from 'src/@core/application/usecases/authenticate.usecase';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { CsrfGenerator } from 'src/@core/application/ports/csrf/csrf_generator.port';
import { RefreshAccessToken } from 'src/@core/application/usecases/refresh_access_token.usecase';

import { AuthenticateDto } from './dtos/authenticate.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticate: Authenticate,
    private readonly refreshAccessToken: RefreshAccessToken,
    @Inject(ConfProvider)
    private readonly confProvider: ConfProvider,
    @Inject(CsrfGenerator)
    private readonly csrfGenerator: CsrfGenerator,
  ) {}

  @Post()
  async signIn(@Body() credentials: AuthenticateDto, @Res() res: Response) {
    const { error, data } = await this.authenticate.execute({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      switch (true) {
        case error instanceof InvalidCredentialsError:
          throw new BadRequestException(error.toJSON());
        default:
          throw new InternalServerErrorException('Authentication failed');
      }
    }

    this.setAccessTokenCookie(
      res,
      data.accessToken.token,
      new Date(data.accessToken.expiresAt),
    );
    this.setRefreshTokenCookie(
      res,
      data.refreshToken.token,
      new Date(data.refreshToken.expiresAt),
    );

    return res.status(HttpStatus.CREATED).send({
      accessTokenExpiresAt: data.accessToken.expiresAt,
      refreshTokenExpiresAt: data.refreshToken.expiresAt,
    });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { error, data } = await this.refreshAccessToken.execute({
      refreshToken: (req.cookies['refreshToken'] as string) ?? '',
    });
    if (error)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: 'Invalid refresh token' });

    this.setAccessTokenCookie(
      res,
      data.accessToken.token,
      new Date(data.accessToken.expiresAt),
    );
    this.setRefreshTokenCookie(
      res,
      data.refreshToken.token,
      new Date(data.refreshToken.expiresAt),
    );

    return res.status(HttpStatus.OK).send({
      accessTokenExpiresAt: data.accessToken.expiresAt,
    });
  }

  @Post('csrf-token')
  async getCsrfToken(@Res() res: Response) {
    const csrfToken = this.csrfGenerator.generate();
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: this.confProvider.get('app.env') === 'production',
      sameSite: 'none',
    });
    return res.status(HttpStatus.CREATED).send({ csrfToken });
  }

  @Delete('sign-out')
  async signOut(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  private setAccessTokenCookie(res: Response, token: string, expiresAt: Date) {
    const secure = this.confProvider.get('app.env') === 'production';
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure,
      sameSite: 'none',
      expires: expiresAt,
      path: '/',
    });
  }

  private setRefreshTokenCookie(res: Response, token: string, expiresAt: Date) {
    const secure = this.confProvider.get('app.env') === 'production';
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure,
      sameSite: 'none',
      expires: expiresAt,
      path: '/auth/refresh-token',
    });
  }
}
