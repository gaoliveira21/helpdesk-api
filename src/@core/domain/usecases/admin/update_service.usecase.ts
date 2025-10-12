import { UseCase } from '../usecase.interface';

export interface UpdateServiceInput {
  serviceId: string;
  adminId: string;
  name?: string;
  price?: number;
  isActive?: boolean;
}

export interface UpdateServiceUseCase
  extends UseCase<UpdateServiceInput, void> {}
