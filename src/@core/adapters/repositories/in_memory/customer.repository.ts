import { CustomerEntity } from 'src/@core/domain/entities';
import { CustomerRepository } from 'src/@core/application/ports/repositories/customer_repository.port';

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers = new Map<string, CustomerEntity>();

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.customers.get(id) ?? null;
  }

  async save(customer: CustomerEntity): Promise<void> {
    this.customers.set(customer.id.toString(), customer);
  }
}
