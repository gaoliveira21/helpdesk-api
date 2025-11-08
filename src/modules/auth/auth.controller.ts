import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Response,
} from '@nestjs/common';
import type { Response as Res } from 'express';

import { InvalidCredentialsError } from 'src/@core/application/errors/invalid_credentials.error';
import { Authenticate } from 'src/@core/application/usecases/authenticate.usecase';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';

import { AuthenticateDto } from './dtos/authenticate.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticate: Authenticate,
    @Inject(ConfProvider)
    private readonly confProvider: ConfProvider,
  ) {}

  @Post()
  async signIn(@Body() credentials: AuthenticateDto, @Response() res: Res) {
    const { error, data } = await this.authenticate.execute({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException({
            type: error.name,
            message: error.message,
          });
        default:
          throw new InternalServerErrorException('Authentication failed');
      }
    }

    const secure = this.confProvider.get('app.env') === 'production';
    res.cookie('accessToken', data.accessToken.token, {
      httpOnly: true,
      secure,
      sameSite: 'none',
      expires: new Date(data.accessToken.expiresAt),
      path: '/',
    });
    res.cookie('refreshToken', data.refreshToken.token, {
      httpOnly: true,
      secure,
      sameSite: 'none',
      expires: new Date(data.refreshToken.expiresAt),
      path: '/auth/refresh-token',
    });

    return res.status(HttpStatus.CREATED).send({
      accessTokenExpiresAt: data.accessToken.expiresAt,
      refreshTokenExpiresAt: data.refreshToken.expiresAt,
    });
  }
}
