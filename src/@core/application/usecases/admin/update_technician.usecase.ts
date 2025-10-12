import {
  UpdateTechnicianInput,
  UpdateTechnicianUseCase,
} from 'src/@core/domain/usecases/admin/update_technician.usecase';

import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';
import { TechnicianRepository } from 'src/@core/application/ports/repositories/technician_repository.port';

export class UpdateTechnician implements UpdateTechnicianUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly technicianRepository: TechnicianRepository,
  ) {}

  async execute(input: UpdateTechnicianInput): Promise<void> {
    const admin = await this.adminRepository.findById(input.adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const technician = await this.technicianRepository.findById(
      input.technicianId,
    );
    if (!technician) {
      throw new Error('Technician not found');
    }

    admin.updateTechnician(technician, input);

    await this.technicianRepository.save(technician);
  }
}
