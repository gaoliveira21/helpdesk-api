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

    expect(result).toEqual({
      page: 1,
      totalPages: 0,
      total: 0,
      technicians: [],
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

    expect(result).toEqual({
      page: 1,
      totalPages: 1,
      total: 2,
      technicians: [
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

    findAllTechniciansQuery.findAll = jest.fn().mockResolvedValue({
      count: 25,
      technicians: [],
    });

    const resultPage1 = await useCase.execute({ page: 1, limit: 10 });
    const resultPage2 = await useCase.execute({ page: 2, limit: 10 });
    const resultPage3 = await useCase.execute({ page: 3, limit: 10 });

    expect(resultPage1.page).toBe(1);
    expect(resultPage1.totalPages).toBe(3);
    expect(resultPage1.total).toBe(25);

    expect(resultPage2.page).toBe(2);
    expect(resultPage2.totalPages).toBe(3);
    expect(resultPage2.total).toBe(25);

    expect(resultPage3.page).toBe(3);
    expect(resultPage3.totalPages).toBe(3);
    expect(resultPage3.total).toBe(25);
  });

  it('should propagate errors from the query', async () => {
    const { useCase, findAllTechniciansQuery } = createUseCase();

    findAllTechniciansQuery.findAll = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute({})).rejects.toThrow('Database error');
  });
});
