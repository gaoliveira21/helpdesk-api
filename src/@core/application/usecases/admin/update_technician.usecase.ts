import {
  UpdateTechnicianInput,
  UpdateTechnicianUseCase,
} from 'src/@core/domain/usecases/admin/update_technician.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';
import { TechnicianRepository } from 'src/@core/application/ports/repositories/technician_repository.port';

export class UpdateTechnician implements UpdateTechnicianUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly technicianRepository: TechnicianRepository,
  ) {}

  async execute(input: UpdateTechnicianInput): Promise<Result<void>> {
    const admin = await this.adminRepository.findById(input.adminId);
    if (!admin) {
      return { error: new Error('Admin not found'), data: null };
    }

    const technician = await this.technicianRepository.findById(
      input.technicianId,
    );
    if (!technician) {
      return { error: new Error('Technician not found'), data: null };
    }

    admin.updateTechnician(technician, input);

    await this.technicianRepository.save(technician);

    return { error: null };
  }
}
