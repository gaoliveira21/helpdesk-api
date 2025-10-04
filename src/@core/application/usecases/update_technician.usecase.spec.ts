import { InMemoryAdminRepository } from 'src/@core/adapters/repositories/in_memory';
import { UpdateTechnicianInput } from 'src/@core/domain/usecases/update_technician.usecase';

import { UpdateTechnician } from './update_technician.usecase';

describe('UpdateTechnicianUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const useCase = new UpdateTechnician(adminRepository);

    return {
      useCase,
    };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase } = createUseCase();
    const input: UpdateTechnicianInput = {
      technicianId: 'tech-id',
      adminId: 'non-existent-admin-id',
      name: 'New Name',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });
});
