import {
  CreateTechnicianInput,
  CreateTechnicianOutput,
  CreateTechnicianUseCase,
} from 'src/@core/domain/usecases/create_technician.usecase';

import { AdminRepository } from '../ports/admin.repository';

export class CreateTechnician implements CreateTechnicianUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: CreateTechnicianInput): Promise<CreateTechnicianOutput> {
    const admin = await this.adminRepository.findById(input.adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    return {
      id: 'generated-id',
    };
  }
}
