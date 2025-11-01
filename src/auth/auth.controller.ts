import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { Authenticate } from 'src/@core/application/usecases/authenticate.usecase';

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
      throw new InternalServerErrorException('Authentication failed');
    }

    return data;
  }
}
