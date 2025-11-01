import { Module } from '@nestjs/common';

import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory';
import { AppConfProvider } from 'src/@core/adapters/conf/app_conf_provider';
import { JwtProvider } from 'src/@core/adapters/jwt';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { JwtSigner } from 'src/@core/application/ports/jwt_signer.port';

import { Authenticate } from 'src/@core/application/usecases/authenticate.usecase';
import { AuthController } from './auth.controller';

@Module({
  providers: [
    {
      provide: ConfProvider,
      useClass: AppConfProvider,
    },
    {
      provide: UserRepository,
      useFactory: () => new InMemoryUserRepository(),
    },
    {
      provide: JwtSigner,
      useFactory: (confProvider: ConfProvider) => new JwtProvider(confProvider),
      inject: [ConfProvider],
    },
    {
      provide: Authenticate,
      useFactory: (
        userRepository: UserRepository,
        jwtSigner: JwtSigner,
        confProvider: ConfProvider,
      ) => new Authenticate(userRepository, jwtSigner, confProvider),
      inject: [UserRepository, JwtSigner, ConfProvider],
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
