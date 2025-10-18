import { InMemoryAdminRepository } from 'src/@core/adapters/repositories/in_memory';
import { InMemoryServiceRepository } from 'src/@core/adapters/repositories/in_memory/service.repository';

import { CreateService } from './create_service.usecase';
import { AdminEntity } from 'src/@core/domain/entities';

describe('CreateServiceUseCase', () => {
  const createUseCase = () => {
    const serviceRepository = new InMemoryServiceRepository();
    const adminRepository = new InMemoryAdminRepository();
    const useCase = new CreateService(adminRepository, serviceRepository);

    return { useCase, adminRepository, serviceRepository };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase } = createUseCase();

    const { error, data } = await useCase.execute({
      adminId: 'non-existent-admin-id',
      name: 'Service 1',
      price: 100,
    });

    expect(error?.message).toBe('Admin not found');
    expect(data).toBeNull();
  });

  it('should create a service', async () => {
    const { useCase, adminRepository, serviceRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin 1',
      email: 'admin1@example.com',
      plainTextPassword: 'admin123',
    });
    await adminRepository.save(admin);

    const { error, data } = await useCase.execute({
      adminId: admin.id.value,
      name: 'Service 1',
      price: 100,
    });

    const service = await serviceRepository.findById(data!.id);

    expect(error).toBeNull();
    expect(service).toBeDefined();
    expect(service?.name).toBe('Service 1');
    expect(service?.price.value).toBe(100);
    expect(service?.adminId.isEqual(admin.id)).toBe(true);
    expect(data).toBeDefined();
    expect(data!.id).toBeDefined();
    expect(data!.id).toBe(service?.id.value);
  });
});
