import { CustomerEntity } from 'src/@core/domain/entities';

export interface CustomerRepository {
  findById(id: string): Promise<CustomerEntity | null>;
  save(customer: CustomerEntity): Promise<void>;
}
