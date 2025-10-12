import {
  UpdateCustomerInput,
  UpdateCustomerUseCase,
} from 'src/@core/domain/usecases/admin/update_customer.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';
import { CustomerRepository } from 'src/@core/application/ports/repositories/customer_repository.port';

export class UpdateCustomer implements UpdateCustomerUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    adminId,
    customerId,
    name,
  }: UpdateCustomerInput): Promise<Result<void>> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) return { error: new Error('Admin not found'), data: null };

    const customer = await this.customerRepository.findById(customerId);
    if (!customer)
      return { error: new Error('Customer not found'), data: null };

    admin.updateCustomer(customer, { name });
    await this.customerRepository.save(customer);

    return { error: null };
  }
}
