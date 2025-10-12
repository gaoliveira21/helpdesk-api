import {
  UpdateServiceInput,
  UpdateServiceUseCase,
} from 'src/@core/domain/usecases/admin/update_service.usecase';

import { ServiceRepository } from 'src/@core/application/ports/repositories/service_repository.port';
import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';

export class UpdateService implements UpdateServiceUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(input: UpdateServiceInput): Promise<void> {
    const { serviceId, adminId, name, price, isActive } = input;

    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    admin.updateService(service, { name, price, isActive });

    await this.serviceRepository.save(service);
  }
}
