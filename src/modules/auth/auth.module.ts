import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TypeORMUserRepository } from 'src/@core/adapters/repositories/typeorm';
import { AppConfProvider } from 'src/@core/adapters/conf/app_conf_provider';
import { JwtProvider } from 'src/@core/adapters/jwt/jwt_provider';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { JwtSignerVerifier } from 'src/@core/application/ports/jwt/jwt_signer_verifier.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { JwtSigner } from 'src/@core/application/ports/jwt/jwt_signer.port';

import { Authenticate } from 'src/@core/application/usecases/authenticate.usecase';
import { RefreshAccessToken } from 'src/@core/application/usecases/refresh_access_token.usecase';

import { AuthController } from './auth.controller';

@Module({
  providers: [
    {
      provide: ConfProvider,
      useClass: AppConfProvider,
    },
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) =>
        new TypeORMUserRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: JwtSigner,
      useFactory: (confProvider: ConfProvider) => new JwtProvider(confProvider),
      inject: [ConfProvider],
    },
    {
      provide: JwtSignerVerifier,
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
    {
      provide: RefreshAccessToken,
      useFactory: (
        jwtSignerVerifier: JwtSignerVerifier,
        confProvider: ConfProvider,
        userRepository: UserRepository,
      ) =>
        new RefreshAccessToken(jwtSignerVerifier, confProvider, userRepository),
      inject: [JwtSignerVerifier, ConfProvider, UserRepository],
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
