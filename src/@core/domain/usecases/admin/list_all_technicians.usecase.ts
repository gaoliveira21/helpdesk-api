import { Paginated, UseCase } from '../usecase.interface';

export interface ListAllTechniciansInput {
  page?: number;
  limit?: number;
}

export interface ListAllTechniciansOutput
  extends Paginated<{
    id: string;
    name: string;
    email: string;
    shift: Array<{
      label: string;
      value: number;
    }>;
    createdAt: string;
    updatedAt: string;
  }> {}

export interface ListAllTechniciansUseCase
  extends UseCase<ListAllTechniciansInput, ListAllTechniciansOutput> {}
