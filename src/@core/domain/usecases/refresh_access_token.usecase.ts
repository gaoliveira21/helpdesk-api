import { UseCase } from './usecase.interface';

export interface RefreshAccessTokenInput {
  refreshToken: string;
}

export interface RefreshAccessTokenOutput {
  accessToken: {
    token: string;
    expiresAt: string;
  };
  refreshToken: {
    token: string;
    expiresAt: string;
  };
}

export interface RefreshAccessTokenUseCase
  extends UseCase<RefreshAccessTokenInput, RefreshAccessTokenOutput> {}
