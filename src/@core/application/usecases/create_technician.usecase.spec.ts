import { AdminEntity } from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';
import { CreateTechnicianInput } from 'src/@core/domain/usecases/create_technician.usecase';
import { InMemoryAdminRepository } from 'src/@core/adapters/repositories/in_memory';

import { CreateTechnician } from './create_technician.usecase';

describe('CreateTechnicianUseCase', () => {
  const createUseCase = () => {
    const admin = AdminEntity.restore({
      id: new Uuid().toString(),
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'hasedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const adminRepository = new InMemoryAdminRepository([admin]);
    const useCase = new CreateTechnician(adminRepository);

    return { admin, useCase, adminRepository };
  };

  it('should throw an error if admin is not found', async () => {
    const { admin, useCase, adminRepository } = createUseCase();
    adminRepository.findById = jest.fn().mockResolvedValueOnce(null);
    const input: CreateTechnicianInput = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
      adminId: admin.id.toString(),
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
    expect(adminRepository.findById).toHaveBeenCalledWith(admin.id.toString());
  });
});
