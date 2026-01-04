import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import * as TypeOrmEntities from 'src/@core/adapters/repositories/typeorm/entities';
import { TypeORMUserRepository } from 'src/@core/adapters/repositories/typeorm';
import { JwtProvider } from 'src/@core/adapters/jwt/jwt_provider';
import { AppConfProvider } from 'src/@core/adapters/conf/app_conf_provider';
import { CsrfProvider } from 'src/@core/adapters/csrf/csrf_provider';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { JwtVerifier } from 'src/@core/application/ports/jwt/jwt_verifier.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { ValidateAuthenticatedUser } from 'src/@core/application/usecases/validate_authenticated_user';
import { CsrfVerifier } from 'src/@core/application/ports/csrf/csrf_verifier.port';

import { AuthMiddleware } from './@shared/middlewares/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CsrfMiddleware } from './@shared/middlewares/csrf.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: Object.values(TypeOrmEntities),
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: ConfProvider,
      useClass: AppConfProvider,
    },
    {
      provide: CsrfVerifier,
      useFactory: (confProvider: ConfProvider) =>
        new CsrfProvider(confProvider),
      inject: [ConfProvider],
    },
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) =>
        new TypeORMUserRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: JwtVerifier,
      useFactory: (confProvider: ConfProvider) => new JwtProvider(confProvider),
      inject: [ConfProvider],
    },
    {
      provide: ValidateAuthenticatedUser,
      useFactory: (userRepository: UserRepository, jwtVerifier: JwtVerifier) =>
        new ValidateAuthenticatedUser(jwtVerifier, userRepository),
      inject: [UserRepository, JwtVerifier, ConfProvider],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .exclude({
        method: RequestMethod.POST,
        path: '/auth/csrf-token',
      })
      .forRoutes('*')
      .apply(AuthMiddleware)
      .exclude(
        {
          method: RequestMethod.POST,
          path: '/auth',
        },
        { method: RequestMethod.POST, path: '/auth/refresh-token' },
        { method: RequestMethod.POST, path: '/auth/csrf-token' },
      )
      .forRoutes('*');
  }
}
