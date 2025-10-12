import {
  ListAllCustomersInput,
  ListAllCustomersOutput,
  ListAllCustomersUseCase,
} from 'src/@core/domain/usecases/admin/list_all_customers.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { FindAllCustomersQuery } from 'src/@core/application/ports/queries/find_all_customers_query.port';

export class ListAllCustomers implements ListAllCustomersUseCase {
  constructor(private readonly findAllCustomersQuery: FindAllCustomersQuery) {}

  async execute(
    input: ListAllCustomersInput = {},
  ): Promise<Result<ListAllCustomersOutput>> {
    const { page = 1, limit = 10 } = input;

    const { count, customers } = await this.findAllCustomersQuery.findAll({
      page,
      limit,
    });

    return {
      data: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        items: customers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          createdAt: customer.createdAt.toISOString(),
          updatedAt: customer.updatedAt.toISOString(),
        })),
      },
      error: null,
    };
  }
}
