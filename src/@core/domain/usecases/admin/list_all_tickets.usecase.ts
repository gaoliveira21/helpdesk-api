import { Paginated, UseCase } from '../usecase.interface';

export interface ListAllTicketsInput {
  page?: number;
  limit?: number;
}

export interface ListAllTicketsOutput
  extends Paginated<{
    id: string;
    name: string;
    status: string;
    totalPrice: { amount: number; currency: string };
    customer: {
      id: string;
      name: string;
    };
    technician: {
      id: string;
      name: string;
    };
    services: {
      name: string;
      price: { amount: number; currency: string };
    }[];
    createdAt: string;
    updatedAt: string;
  }> {}

export interface ListAllTicketsUseCase
  extends UseCase<ListAllTicketsInput, ListAllTicketsOutput> {}
