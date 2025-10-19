import { FindAllTicketsQuery } from 'src/@core/application/ports/queries/find_all_tickets_query.port';
import { ListAllTickets } from './list_all_tickets.usecase';

describe('ListAllTicketsUseCase', () => {
  const createUseCase = () => {
    const findAllTicketsQuery: FindAllTicketsQuery = {
      findAll: jest.fn(),
    };

    const useCase = new ListAllTickets(findAllTicketsQuery);

    return { useCase, findAllTicketsQuery };
  };

  it('should return an empty list if there are no tickets', async () => {
    const { useCase, findAllTicketsQuery } = createUseCase();

    findAllTicketsQuery.findAll = jest.fn().mockResolvedValue({
      count: 0,
      tickets: [],
    });

    const result = await useCase.execute({});

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      items: [],
    });
  });

  it('should return a list of tickets', async () => {
    const { useCase, findAllTicketsQuery } = createUseCase();

    const now = new Date();
    findAllTicketsQuery.findAll = jest.fn().mockResolvedValue({
      count: 2,
      tickets: [
        {
          id: '1',
          name: 'Ticket One',
          status: 'open',
          services: [
            { name: 'Service A', price: 100 },
            { name: 'Service B', price: 150 },
          ],
          customer: { id: 'c1', name: 'Customer One' },
          technician: { id: 't1', name: 'Technician One' },
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          name: 'Ticket Two',
          status: 'closed',
          services: [{ name: 'Service C', price: 200 }],
          customer: { id: 'c2', name: 'Customer Two' },
          technician: { id: 't2', name: 'Technician Two' },
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    const result = await useCase.execute({});

    expect(findAllTicketsQuery.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      items: [
        {
          id: '1',
          name: 'Ticket One',
          status: 'open',
          totalPrice: { amount: 250, currency: 'BRL' },
          customer: { id: 'c1', name: 'Customer One' },
          technician: { id: 't1', name: 'Technician One' },
          services: [
            { name: 'Service A', price: { amount: 100, currency: 'BRL' } },
            { name: 'Service B', price: { amount: 150, currency: 'BRL' } },
          ],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: '2',
          name: 'Ticket Two',
          status: 'closed',
          totalPrice: { amount: 200, currency: 'BRL' },
          customer: { id: 'c2', name: 'Customer Two' },
          technician: { id: 't2', name: 'Technician Two' },
          services: [
            { name: 'Service C', price: { amount: 200, currency: 'BRL' } },
          ],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ],
    });
  });

  it('should handle pagination correctly', async () => {
    const { useCase, findAllTicketsQuery } = createUseCase();

    const now = new Date();
    findAllTicketsQuery.findAll = jest.fn().mockResolvedValue({
      count: 15,
      tickets: Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Ticket ${i + 1}`,
        status: 'open',
        services: [{ name: 'Service X', price: 100 }],
        customer: { id: `c${i + 1}`, name: `Customer ${i + 1}` },
        technician: { id: `t${i + 1}`, name: `Technician ${i + 1}` },
        createdAt: now,
        updatedAt: now,
      })),
    });

    const result = await useCase.execute({ page: 2, limit: 5 });

    expect(findAllTicketsQuery.findAll).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
    });
    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 15,
      items: Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Ticket ${i + 1}`,
        status: 'open',
        totalPrice: { amount: 100, currency: 'BRL' },
        customer: { id: `c${i + 1}`, name: `Customer ${i + 1}` },
        technician: { id: `t${i + 1}`, name: `Technician ${i + 1}` },
        services: [
          { name: 'Service X', price: { amount: 100, currency: 'BRL' } },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      })),
    });
  });

  it('should propagate errors from the query', async () => {
    const { useCase, findAllTicketsQuery } = createUseCase();

    findAllTicketsQuery.findAll = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute({})).rejects.toThrow('Database error');
  });
});
