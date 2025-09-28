import { CreateTechnicianInput } from 'src/@core/domain/usecases/create_technician.usecase';
import { InMemoryAdminRepository } from 'src/@core/adapters/repositories/in_memory';

import { CreateTechnician } from './create_technician.usecase';

describe('CreateTechnicianUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const useCase = new CreateTechnician(adminRepository);

    return { useCase, adminRepository };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase, adminRepository } = createUseCase();
    adminRepository.findById = jest.fn().mockResolvedValueOnce(null);
    const input: CreateTechnicianInput = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
      adminId: 'non-existent-admin-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
    expect(adminRepository.findById).toHaveBeenCalledWith(
      'non-existent-admin-id',
    );
  });
});
