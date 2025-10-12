import {
  CreateServiceInput,
  CreateServiceOutput,
  CreateServiceUseCase,
} from 'src/@core/domain/usecases/admin/create_service.usecase';

import { AdminRepository } from '../../ports/repositories/admin_repository.port';
import { ServiceRepository } from '../../ports/repositories/service_repository.port';

export class CreateService implements CreateServiceUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute({
    adminId,
    name,
    price,
  }: CreateServiceInput): Promise<CreateServiceOutput> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const service = admin.createService(name, price);
    await this.serviceRepository.save(service);

    return {
      id: service.id.value,
    };
  }
}
