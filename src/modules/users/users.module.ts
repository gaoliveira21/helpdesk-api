import { Module } from '@nestjs/common';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';

import { UsersController } from './users.controller';
import { DataSource } from 'typeorm';
import { TypeORMUserRepository } from 'src/@core/adapters/repositories/typeorm';
import { UpdatePassword } from 'src/@core/application/usecases/update_password.usecase';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) =>
        new TypeORMUserRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: UpdatePassword,
      useFactory: (userRepository: UserRepository) =>
        new UpdatePassword(userRepository),
      inject: [UserRepository],
    },
  ],
  exports: [],
})
export class UsersModule {}
