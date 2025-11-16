import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { CreateService } from 'src/@core/application/usecases/admin/create_service.usecase';

import { User } from '../@shared/decorators/user.decorator';
import type { AuthenticatedUser } from '../@shared/types/authenticated_user.type';

import { CreateServiceDto } from './dtos/create_service.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly createService: CreateService) {}

  @Post('/services')
  async createTicketService(
    @User() user: AuthenticatedUser,
    @Body() dto: CreateServiceDto,
  ) {
    const { error, data } = await this.createService.execute({
      adminId: user.id,
      name: dto.name,
      price: dto.price,
    });

    if (error)
      throw new InternalServerErrorException('Failed to create service');

    return { id: data.id };
  }
}
