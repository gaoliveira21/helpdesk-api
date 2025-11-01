import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { Authenticate } from 'src/@core/application/usecases/authenticate.usecase';
import { InvalidCredentialsError } from 'src/@core/application/errors/invalid_credentials.error';

import { AuthenticateDto } from './dtos/authenticate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticate: Authenticate) {}

  @Post()
  async signIn(@Body() credentials: AuthenticateDto) {
    const { error, data } = await this.authenticate.execute({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException('Authentication failed');
      }
    }

    return data;
  }
}
