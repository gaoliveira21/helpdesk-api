import { InMemoryAdminRepository } from 'src/@core/adapters/repositories/in_memory';
import { InMemoryServiceRepository } from 'src/@core/adapters/repositories/in_memory/service.repository';

import { UpdateService } from './update_service.usecase';
import { AdminEntity, ServiceEntity } from 'src/@core/domain/entities';
import { UpdateServiceInput } from 'src/@core/domain/usecases/admin/update_service.usecase';

describe('UpdateServiceUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const serviceRepository = new InMemoryServiceRepository();

    const useCase = new UpdateService(adminRepository, serviceRepository);

    return { useCase, adminRepository, serviceRepository };
  };

  it('should throw an error if admin does not exist', async () => {
    const { useCase } = createUseCase();

    const input: UpdateServiceInput = {
      serviceId: 'service-1',
      adminId: 'non-existent-admin',
      name: 'Updated Service',
      price: 150,
      isActive: true,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });

  it('should throw an error if service does not exist', async () => {
    const { useCase, adminRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'securepassword',
    });
    await adminRepository.save(admin);

    const input: UpdateServiceInput = {
      serviceId: 'non-existent-service',
      adminId: admin.id.value,
      name: 'Updated Service',
      price: 150,
      isActive: true,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Service not found');
  });

  it('should update the service successfully', async () => {
    const { useCase, adminRepository, serviceRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'securepassword',
    });
    await adminRepository.save(admin);

    const service = ServiceEntity.create({
      name: 'Original Service',
      price: 100,
      createdBy: admin,
    });
    await serviceRepository.save(service);

    const input: UpdateServiceInput = {
      serviceId: service.id.value,
      adminId: admin.id.value,
      name: 'Updated Service',
      price: 150,
      isActive: false,
    };

    await useCase.execute(input);

    const updatedService = await serviceRepository.findById(service.id.value);
    expect(updatedService).toBeDefined();
    expect(updatedService?.name).toBe('Updated Service');
    expect(updatedService?.price.value).toBe(150);
    expect(updatedService?.isActive()).toBe(false);
  });
});
