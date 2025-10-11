import { UseCase } from '../usecase.interface';

export interface CreateServiceInput {
  adminId: string;
  name: string;
  price: number;
}

export interface CreateServiceOutput {
  id: string;
}

export interface CreateServiceUseCase
  extends UseCase<CreateServiceInput, CreateServiceOutput> {}
