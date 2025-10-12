import {
  FindAllServicesQuery,
  ServicesFound,
} from 'src/@core/application/ports/queries/find_all_services_query.port';

import { ListAllServices } from './list_all_services.usecase';

describe('ListAllServicesUseCase', () => {
  const createUseCase = () => {
    const findAllServicesQuery: FindAllServicesQuery = {
      findAll: jest.fn(),
    };

    const useCase = new ListAllServices(findAllServicesQuery);

    return { useCase, findAllServicesQuery };
  };

  it('should return an empty list if there are no services', async () => {
    const { useCase, findAllServicesQuery } = createUseCase();

    findAllServicesQuery.findAll = jest.fn().mockResolvedValue({
      count: 0,
      services: [],
    } as ServicesFound);

    const result = await useCase.execute({});

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      items: [],
    });
  });

  it('should return a list of services', async () => {
    const { useCase, findAllServicesQuery } = createUseCase();

    const now = new Date();
    findAllServicesQuery.findAll = jest.fn().mockResolvedValue({
      count: 2,
      services: [
        {
          id: '1',
          name: 'Service One',
          price: 100,
          createdAt: now,
          updatedAt: now,
          isActive: true,
        },
        {
          id: '2',
          name: 'Service Two',
          price: 200,
          createdAt: now,
          updatedAt: now,
          isActive: false,
        },
      ],
    } as ServicesFound);

    const result = await useCase.execute({});

    expect(findAllServicesQuery.findAll).toHaveBeenCalledWith({
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
          name: 'Service One',
          price: { amount: 100, currency: 'BRL' },
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          isActive: true,
        },
        {
          id: '2',
          name: 'Service Two',
          price: { amount: 200, currency: 'BRL' },
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          isActive: false,
        },
      ],
    });
  });

  it('should handle pagination correctly', async () => {
    const { useCase, findAllServicesQuery } = createUseCase();

    const now = new Date();
    findAllServicesQuery.findAll = jest
      .fn()
      .mockResolvedValueOnce({
        count: 25,
        services: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          name: `Service ${i + 1}`,
          price: (i + 1) * 100,
          createdAt: now,
          updatedAt: now,
          isActive: i % 2 === 0,
        })),
      } as ServicesFound)
      .mockResolvedValueOnce({
        count: 25,
        services: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 11}`,
          name: `Service ${i + 11}`,
          price: (i + 11) * 100,
          createdAt: now,
          updatedAt: now,
          isActive: i % 2 === 0,
        })),
      } as ServicesFound)
      .mockResolvedValueOnce({
        count: 25,
        services: Array.from({ length: 5 }, (_, i) => ({
          id: `${i + 21}`,
          name: `Service ${i + 21}`,
          price: (i + 21) * 100,
          createdAt: now,
          updatedAt: now,
          isActive: i % 2 === 0,
        })),
      } as ServicesFound);

    const resultPage1 = await useCase.execute({ page: 1, limit: 10 });
    const resultPage2 = await useCase.execute({ page: 2, limit: 10 });
    const resultPage3 = await useCase.execute({ page: 3, limit: 10 });

    expect(resultPage1.error).toBeNull();
    expect(resultPage1.data!.currentPage).toBe(1);
    expect(resultPage1.data!.totalPages).toBe(3);
    expect(resultPage1.data!.totalItems).toBe(25);
    expect(resultPage1.data!.items).toHaveLength(10);
    expect(resultPage1.data!.items[0]).toEqual({
      id: '1',
      name: 'Service 1',
      price: { amount: 100, currency: 'BRL' },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      isActive: true,
    });

    expect(resultPage2.error).toBeNull();
    expect(resultPage2.data!.currentPage).toBe(2);
    expect(resultPage2.data!.totalPages).toBe(3);
    expect(resultPage2.data!.totalItems).toBe(25);
    expect(resultPage2.data!.items).toHaveLength(10);
    expect(resultPage2.data!.items[0]).toEqual({
      id: '11',
      name: 'Service 11',
      price: { amount: 1100, currency: 'BRL' },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      isActive: true,
    });

    expect(resultPage3.error).toBeNull();
    expect(resultPage3.data!.currentPage).toBe(3);
    expect(resultPage3.data!.totalPages).toBe(3);
    expect(resultPage3.data!.totalItems).toBe(25);
    expect(resultPage3.data!.items).toHaveLength(5);
    expect(resultPage3.data!.items[0]).toEqual({
      id: '21',
      name: 'Service 21',
      price: { amount: 2100, currency: 'BRL' },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      isActive: true,
    });
  });

  it('should propagate errors from the query', async () => {
    const { useCase, findAllServicesQuery } = createUseCase();

    findAllServicesQuery.findAll = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute({})).rejects.toThrow('Database error');
  });
});
