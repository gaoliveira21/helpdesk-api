import {
  DeleteCustomerInput,
  DeleteCustomerUseCase,
} from 'src/@core/domain/usecases/admin/delete_customer.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { CustomerRepository } from 'src/@core/application/ports/repositories/customer_repository.port';

export class DeleteCustomer implements DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({ customerId }: DeleteCustomerInput): Promise<Result<void>> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      return { error: new Error('Customer not found'), data: null };
    }

    await this.customerRepository.delete(customerId);

    return { error: null };
  }
}
