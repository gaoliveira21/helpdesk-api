import {
  ListAllTechniciansInput,
  ListAllTechniciansOutput,
  ListAllTechniciansUseCase,
} from 'src/@core/domain/usecases/admin/list_all_technicians.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { FindAllTechniciansQuery } from '../../ports/queries/find_all_technicians_query.port';
import { Hour } from 'src/@core/domain/value_objects';

export class ListAllTechnicians implements ListAllTechniciansUseCase {
  constructor(
    private readonly findAllTechniciansQuery: FindAllTechniciansQuery,
  ) {}

  async execute(
    input: ListAllTechniciansInput = {},
  ): Promise<Result<ListAllTechniciansOutput>> {
    const { page = 1, limit = 10 } = input;

    const { count, technicians } = await this.findAllTechniciansQuery.findAll({
      page,
      limit,
    });

    return {
      data: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        items: technicians.map((tech) => ({
          id: tech.id,
          name: tech.name,
          email: tech.email,
          shift: tech.shift.map((h) => ({
            label: new Hour(h).toString(),
            value: h,
          })),
          createdAt: tech.createdAt.toISOString(),
          updatedAt: tech.updatedAt.toISOString(),
        })),
      },
      error: null,
    };
  }
}
