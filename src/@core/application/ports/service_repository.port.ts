import { ServiceEntity } from 'src/@core/domain/entities';

export interface ServiceRepository {
  save(service: ServiceEntity): Promise<void>;
  findById(id: string): Promise<ServiceEntity | null>;
}
