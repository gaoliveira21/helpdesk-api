import {
  CreateServiceInput,
  CreateServiceOutput,
  CreateServiceUseCase,
} from 'src/@core/domain/usecases/admin/create_service.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

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
  }: CreateServiceInput): Promise<Result<CreateServiceOutput>> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      return { error: new Error('Admin not found'), data: null };
    }

    const service = admin.createService(name, price);
    await this.serviceRepository.save(service);

    return {
      data: { id: service.id.value },
      error: null,
    };
  }
}
