import { UserRoleEnum } from '../enum/user_role.enum';
import { UseCase } from './usecase.interface';

export interface ValidateAuthenticatedUserInput {
  accessToken: string;
}

export interface ValidateAuthenticatedUserOutput {
  userId: string;
  email: string;
  role: UserRoleEnum;
}

export interface ValidateAuthenticatedUserUseCase
  extends UseCase<
    ValidateAuthenticatedUserInput,
    ValidateAuthenticatedUserOutput
  > {}
