import { UseCase } from './usecase.interface';

export interface UpdatePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordUseCase
  extends UseCase<UpdatePasswordInput, undefined> {}
