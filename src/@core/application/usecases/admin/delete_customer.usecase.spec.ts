import { InMemoryCustomerRepository } from 'src/@core/adapters/repositories/in_memory';

import { DeleteCustomer } from './delete_customer.usecase';
import { CustomerEntity } from 'src/@core/domain/entities';

describe('DeleteCustomerUseCase', () => {
  const createUseCase = () => {
    const customerRepository = new InMemoryCustomerRepository();

    const useCase = new DeleteCustomer(customerRepository);

    return { useCase, customerRepository };
  };

  it('should return an error if customer does not exist', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({ customerId: 'non-existent-id' });

    expect(result.error?.message).toBe('Customer not found');
  });

  it('should delete an existing customer', async () => {
    const { useCase, customerRepository } = createUseCase();

    const customer = await CustomerEntity.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      plainTextPassword: 'password123',
    });
    await customerRepository.save(customer);

    const result = await useCase.execute({ customerId: customer.id.value });
    const deletedCustomer = await customerRepository.findById(
      customer.id.value,
    );

    expect(deletedCustomer).toBeNull();
    expect(result.error).toBeNull();
  });
});
