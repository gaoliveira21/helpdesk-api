import { FindAllCustomersQuery } from 'src/@core/application/ports/queries/find_all_customers_query.port';
import { ListAllCustomers } from './list_all_customers.usecase';

describe('ListAllCustomersUseCase', () => {
  const createUseCase = () => {
    const findAllCustomersQuery: FindAllCustomersQuery = {
      findAll: jest.fn(),
    };

    const useCase = new ListAllCustomers(findAllCustomersQuery);

    return { useCase, findAllCustomersQuery };
  };

  it('should return an empty list if there are no customers', async () => {
    const { useCase, findAllCustomersQuery } = createUseCase();

    findAllCustomersQuery.findAll = jest.fn().mockResolvedValue({
      count: 0,
      customers: [],
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

  it('should return a list of customers', async () => {
    const { useCase, findAllCustomersQuery } = createUseCase();

    const now = new Date();
    findAllCustomersQuery.findAll = jest.fn().mockResolvedValue({
      count: 2,
      customers: [
        {
          id: '1',
          name: 'Customer One',
          email: 'customer1@example.com',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          name: 'Customer Two',
          email: 'customer2@example.com',
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    const result = await useCase.execute({});

    expect(findAllCustomersQuery.findAll).toHaveBeenCalledWith({
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
          name: 'Customer One',
          email: 'customer1@example.com',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: '2',
          name: 'Customer Two',
          email: 'customer2@example.com',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ],
    });
  });

  it('should handle pagination correctly', async () => {
    const { useCase, findAllCustomersQuery } = createUseCase();

    const now = new Date();
    findAllCustomersQuery.findAll = jest
      .fn()
      .mockResolvedValueOnce({
        count: 25,
        customers: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          createdAt: now,
          updatedAt: now,
        })),
      })
      .mockResolvedValueOnce({
        count: 25,
        customers: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 11}`,
          name: `Customer ${i + 11}`,
          email: `customer${i + 11}@example.com`,
          createdAt: now,
          updatedAt: now,
        })),
      })
      .mockResolvedValueOnce({
        count: 25,
        customers: Array.from({ length: 5 }, (_, i) => ({
          id: `${i + 21}`,
          name: `Customer ${i + 21}`,
          email: `customer${i + 21}@example.com`,
          createdAt: now,
          updatedAt: now,
        })),
      });

    const firstPage = await useCase.execute({ page: 1, limit: 10 });
    const secondPage = await useCase.execute({ page: 2, limit: 10 });
    const thirdPage = await useCase.execute({ page: 3, limit: 10 });

    expect(firstPage.error).toBeNull();
    expect(firstPage.data!.currentPage).toBe(1);
    expect(firstPage.data!.totalPages).toBe(3);
    expect(firstPage.data!.totalItems).toBe(25);
    expect(firstPage.data!.items).toHaveLength(10);
    expect(findAllCustomersQuery.findAll).toHaveBeenNthCalledWith(1, {
      page: 1,
      limit: 10,
    });
    expect(firstPage.data!.items[0]).toEqual({
      id: '1',
      name: 'Customer 1',
      email: 'customer1@example.com',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    expect(secondPage.error).toBeNull();
    expect(secondPage.data!.currentPage).toBe(2);
    expect(secondPage.data!.totalPages).toBe(3);
    expect(secondPage.data!.totalItems).toBe(25);
    expect(secondPage.data!.items).toHaveLength(10);
    expect(findAllCustomersQuery.findAll).toHaveBeenNthCalledWith(2, {
      page: 2,
      limit: 10,
    });
    expect(secondPage.data!.items[0]).toEqual({
      id: '11',
      name: 'Customer 11',
      email: 'customer11@example.com',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    expect(thirdPage.error).toBeNull();
    expect(thirdPage.data!.currentPage).toBe(3);
    expect(thirdPage.data!.totalPages).toBe(3);
    expect(thirdPage.data!.totalItems).toBe(25);
    expect(thirdPage.data!.items).toHaveLength(5);
    expect(findAllCustomersQuery.findAll).toHaveBeenNthCalledWith(3, {
      page: 3,
      limit: 10,
    });
    expect(thirdPage.data!.items[0]).toEqual({
      id: '21',
      name: 'Customer 21',
      email: 'customer21@example.com',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });
});
