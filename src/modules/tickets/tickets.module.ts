import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';
import { ServiceRepository } from 'src/@core/application/ports/repositories/service_repository.port';
import { CreateService } from 'src/@core/application/usecases/admin/create_service.usecase';

import {
  TypeORMAdminRepository,
  TypeORMServiceRepository,
} from 'src/@core/adapters/repositories/typeorm';

import { TicketsController } from './tickets.controller';

@Module({
  imports: [],
  providers: [
    {
      provide: AdminRepository,
      useFactory: (dataSource: DataSource) =>
        new TypeORMAdminRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: ServiceRepository,
      useFactory: (dataSource: DataSource) =>
        new TypeORMServiceRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: CreateService,
      useFactory: (
        adminRepo: AdminRepository,
        serviceRepo: ServiceRepository,
      ) => new CreateService(adminRepo, serviceRepo),
      inject: [AdminRepository, ServiceRepository],
    },
  ],
  controllers: [TicketsController],
  exports: [],
})
export class TicketsModule {}
