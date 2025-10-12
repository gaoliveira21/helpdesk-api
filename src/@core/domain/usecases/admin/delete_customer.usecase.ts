import { UseCase } from '../usecase.interface';

export interface DeleteCustomerInput {
  customerId: string;
}

export interface DeleteCustomerUseCase
  extends UseCase<DeleteCustomerInput, void> {}
