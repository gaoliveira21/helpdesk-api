import {
  ListAllServicesInput,
  ListAllServicesOutput,
  ListAllServicesUseCase,
} from 'src/@core/domain/usecases/admin/list_all_services.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { FindAllServicesQuery } from 'src/@core/application/ports/queries/find_all_services_query.port';

export class ListAllServices implements ListAllServicesUseCase {
  constructor(private readonly findAllServicesQuery: FindAllServicesQuery) {}

  async execute(
    input: ListAllServicesInput,
  ): Promise<Result<ListAllServicesOutput>> {
    const { page = 1, limit = 10 } = input;

    const { count, services } = await this.findAllServicesQuery.findAll({
      page,
      limit,
    });

    return {
      data: {
        items: services.map((service) => ({
          id: service.id,
          name: service.name,
          price: {
            amount: service.price,
            currency: 'BRL',
          },
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          isActive: service.isActive,
        })),
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
      error: null,
    };
  }
}
