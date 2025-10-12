import {
  InMemoryAdminRepository,
  InMemoryCustomerRepository,
} from 'src/@core/adapters/repositories/in_memory';
import { UpdateCustomer } from './update_customer.usecase';
import { AdminEntity, CustomerEntity } from 'src/@core/domain/entities';

describe('UpdateCustomerUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const customerRepository = new InMemoryCustomerRepository();

    const useCase = new UpdateCustomer(adminRepository, customerRepository);

    return { useCase, adminRepository, customerRepository };
  };

  it('should return error if admin does not exist', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      adminId: 'non-existent-admin-id',
      customerId: 'any-customer-id',
      name: 'New Customer Name',
    });

    expect(result.error?.message).toBe('Admin not found');
  });

  it('should return error if customer does not exist', async () => {
    const { useCase, adminRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin Name',
      email: 'admin@example.com',
      plainTextPassword: 'password123',
    });
    await adminRepository.save(admin);

    const result = await useCase.execute({
      adminId: admin.id.value,
      customerId: 'non-existent-customer-id',
      name: 'New Customer Name',
    });

    expect(result.error?.message).toBe('Customer not found');
  });

  it('should update customer successfully', async () => {
    const { useCase, adminRepository, customerRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin Name',
      email: 'admin@example.com',
      plainTextPassword: 'password123',
    });
    await adminRepository.save(admin);

    const customer = await CustomerEntity.create({
      name: 'Customer Name',
      email: 'customer@example.com',
      plainTextPassword: 'password123',
    });
    await customerRepository.save(customer);

    const result = await useCase.execute({
      adminId: admin.id.value,
      customerId: customer.id.value,
      name: 'Updated Customer Name',
    });

    const updatedCustomer = await customerRepository.findById(
      customer.id.value,
    );

    expect(result.error).toBeNull();
    expect(updatedCustomer?.name).toBe('Updated Customer Name');
  });
});
