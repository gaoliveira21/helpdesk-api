import { Paginated, UseCase } from '../usecase.interface';

export interface ListAllServicesInput {
  page?: number;
  limit?: number;
}

export interface ListAllServicesOutput
  extends Paginated<{
    id: string;
    name: string;
    price: { amount: number; currency: string };
    createdAt: string;
    updatedAt: string;
  }> {}

export interface ListAllServicesUseCase
  extends UseCase<ListAllServicesInput, ListAllServicesOutput> {}
