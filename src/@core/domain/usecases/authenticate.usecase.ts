import { UseCase } from './usecase.interface';

export interface AuthenticateInput {
  email: string;
  password: string;
}

export interface AuthenticateOutput {
  accessToken: {
    token: string;
    expiresAt: string;
  };
}

export interface AuthenticateUseCase
  extends UseCase<AuthenticateInput, AuthenticateOutput> {}
