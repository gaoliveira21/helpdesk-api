import { Paginated, UseCase } from '../usecase.interface';

export interface ListAllCustomersInput {
  page?: number;
  limit?: number;
}

export interface ListAllCustomersOutput
  extends Paginated<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }> {}

export interface ListAllCustomersUseCase
  extends UseCase<ListAllCustomersInput, ListAllCustomersOutput> {}
