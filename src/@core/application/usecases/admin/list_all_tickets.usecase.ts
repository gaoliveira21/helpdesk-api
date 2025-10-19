import {
  ListAllTicketsInput,
  ListAllTicketsOutput,
  ListAllTicketsUseCase,
} from 'src/@core/domain/usecases/admin/list_all_tickets.usecase';
import { FindAllTicketsQuery } from '../../ports/queries/find_all_tickets_query.port';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

export class ListAllTickets implements ListAllTicketsUseCase {
  constructor(private readonly findAllTicketsQuery: FindAllTicketsQuery) {}

  async execute(
    input: ListAllTicketsInput,
  ): Promise<Result<ListAllTicketsOutput>> {
    const { page = 1, limit = 10 } = input;

    const { count, tickets } = await this.findAllTicketsQuery.findAll({
      page,
      limit,
    });

    return {
      data: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        items: tickets.map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          status: ticket.status,
          totalPrice: {
            amount: ticket.services.reduce(
              (sum, service) => sum + service.price,
              0,
            ),
            currency: 'BRL',
          },
          customer: {
            id: ticket.customer.id,
            name: ticket.customer.name,
          },
          technician: {
            id: ticket.technician.id,
            name: ticket.technician.name,
          },
          services: ticket.services.map((service) => ({
            name: service.name,
            price: {
              amount: service.price,
              currency: 'BRL',
            },
          })),
          createdAt: ticket.createdAt.toISOString(),
          updatedAt: ticket.updatedAt.toISOString(),
        })),
      },
      error: null,
    };
  }
}
