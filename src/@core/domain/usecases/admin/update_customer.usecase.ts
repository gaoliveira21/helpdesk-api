import { UseCase } from '../usecase.interface';

export interface UpdateCustomerInput {
  adminId: string;
  customerId: string;
  name?: string;
}

export interface UpdateCustomerUseCase
  extends UseCase<UpdateCustomerInput, void> {}
