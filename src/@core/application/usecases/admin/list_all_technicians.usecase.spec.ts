import {
  FindAllTechniciansQuery,
  TechniciansFound,
} from '../../ports/queries/find_all_technicians_query.port';
import { ListAllTechnicians } from './list_all_technicians.usecase';

describe('ListAllTechniciansUseCase', () => {
  const createUseCase = () => {
    const findAllTechniciansQuery: FindAllTechniciansQuery = {
      findAll: jest.fn(),
    };

    const useCase = new ListAllTechnicians(findAllTechniciansQuery);

    return { useCase, findAllTechniciansQuery };
  };

  it('should return an empty list if there are no technicians', async () => {
    const { useCase, findAllTechniciansQuery } = createUseCase();

    findAllTechniciansQuery.findAll = jest.fn().mockResolvedValue({
      count: 0,
      technicians: [],
    } as TechniciansFound);

    const result = await useCase.execute({});

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      items: [],
    });
  });

  it('should return a list of technicians', async () => {
    const { useCase, findAllTechniciansQuery } = createUseCase();

    const now = new Date();
    findAllTechniciansQuery.findAll = jest.fn().mockResolvedValue({
      count: 2,
      technicians: [
        {
          id: '1',
          name: 'Tech One',
          email: 'tech.one@example.com',
          shift: [1, 2, 3],
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          name: 'Tech Two',
          email: 'tech.two@example.com',
          shift: [4, 5, 6],
          createdAt: now,
          updatedAt: now,
        },
      ],
    } as TechniciansFound);

    const result = await useCase.execute({});

    expect(findAllTechniciansQuery.findAll).toHaveBeenCalledWith({
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
          name: 'Tech One',
          email: 'tech.one@example.com',
          shift: [
            { label: '01:00', value: 1 },
            { label: '02:00', value: 2 },
            { label: '03:00', value: 3 },
          ],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: '2',
          name: 'Tech Two',
          email: 'tech.two@example.com',
          shift: [
            { label: '04:00', value: 4 },
            { label: '05:00', value: 5 },
            { label: '06:00', value: 6 },
          ],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ],
    });
  });

  it('should handle pagination correctly', async () => {
    const { useCase, findAllTechniciansQuery } = createUseCase();

    const now = new Date();
    findAllTechniciansQuery.findAll = jest
      .fn()
      .mockResolvedValueOnce({
        count: 25,
        technicians: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          name: `Tech ${i + 1}`,
          email: `tech${i + 1}@example.com`,
          shift: [1, 2, 3],
          createdAt: now,
          updatedAt: now,
        })),
      })
      .mockResolvedValueOnce({
        count: 25,
        technicians: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 11}`,
          name: `Tech ${i + 11}`,
          email: `tech${i + 11}@example.com`,
          shift: [4, 5, 6],
          createdAt: now,
          updatedAt: now,
        })),
      })
      .mockResolvedValueOnce({
        count: 25,
        technicians: Array.from({ length: 5 }, (_, i) => ({
          id: `${i + 21}`,
          name: `Tech ${i + 21}`,
          email: `tech${i + 21}@example.com`,
          shift: [7, 8, 9],
          createdAt: now,
          updatedAt: now,
        })),
      });

    const resultPage1 = await useCase.execute({ page: 1, limit: 10 });
    const resultPage2 = await useCase.execute({ page: 2, limit: 10 });
    const resultPage3 = await useCase.execute({ page: 3, limit: 10 });

    expect(resultPage1.error).toBeNull();
    expect(resultPage1.data!.currentPage).toBe(1);
    expect(resultPage1.data!.totalPages).toBe(3);
    expect(resultPage1.data!.totalItems).toBe(25);
    expect(findAllTechniciansQuery.findAll).toHaveBeenNthCalledWith(1, {
      page: 1,
      limit: 10,
    });
    expect(resultPage1.data!.items[0]).toEqual({
      id: '1',
      name: 'Tech 1',
      email: 'tech1@example.com',
      shift: [
        { label: '01:00', value: 1 },
        { label: '02:00', value: 2 },
        { label: '03:00', value: 3 },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    expect(resultPage2.error).toBeNull();
    expect(resultPage2.data!.currentPage).toBe(2);
    expect(resultPage2.data!.totalPages).toBe(3);
    expect(resultPage2.data!.totalItems).toBe(25);
    expect(findAllTechniciansQuery.findAll).toHaveBeenNthCalledWith(2, {
      page: 2,
      limit: 10,
    });
    expect(resultPage2.data!.items[0]).toEqual({
      id: '11',
      name: 'Tech 11',
      email: 'tech11@example.com',
      shift: [
        { label: '04:00', value: 4 },
        { label: '05:00', value: 5 },
        { label: '06:00', value: 6 },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    expect(resultPage3.error).toBeNull();
    expect(resultPage3.data!.currentPage).toBe(3);
    expect(resultPage3.data!.totalPages).toBe(3);
    expect(resultPage3.data!.totalItems).toBe(25);
    expect(findAllTechniciansQuery.findAll).toHaveBeenNthCalledWith(3, {
      page: 3,
      limit: 10,
    });
    expect(resultPage3.data!.items[0]).toEqual({
      id: '21',
      name: 'Tech 21',
      email: 'tech21@example.com',
      shift: [
        { label: '07:00', value: 7 },
        { label: '08:00', value: 8 },
        { label: '09:00', value: 9 },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it('should propagate errors from the query', async () => {
    const { useCase, findAllTechniciansQuery } = createUseCase();

    findAllTechniciansQuery.findAll = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute({})).rejects.toThrow('Database error');
  });
});
