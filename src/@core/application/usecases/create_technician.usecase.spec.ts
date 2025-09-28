import { CreateTechnicianInput } from 'src/@core/domain/usecases/create_technician.usecase';

import { AdminRepository } from '../ports/admin.repository';
import { CreateTechnician } from './create_technician.usecase';

describe('CreateTechnicianUseCase', () => {
  let useCase: CreateTechnician;
  let adminRepository: AdminRepository;

  beforeEach(() => {
    adminRepository = {
      findById: jest.fn(),
    };
    useCase = new CreateTechnician(adminRepository);
  });

  it('should throw an error if admin is not found', async () => {
    adminRepository.findById = jest.fn().mockResolvedValueOnce(null);
    const input: CreateTechnicianInput = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
      adminId: 'non-existent-admin-id',
    };

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });
});
