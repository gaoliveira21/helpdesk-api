import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';

import { UpdatePassword } from 'src/@core/application/usecases/update_password.usecase';

import { User } from 'src/modules/@shared/decorators/user.decorator';
import type { AuthenticatedUser } from 'src/modules/@shared/types/authenticated_user.type';

import { UpdateUserPasswordDto } from './dtos/update_user_password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly updatePassword: UpdatePassword) {}

  @Patch('/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserPassword(
    @Body() dto: UpdateUserPasswordDto,
    @User() user: AuthenticatedUser,
  ) {
    const { error } = await this.updatePassword.execute({
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
      userId: user.id,
    });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
