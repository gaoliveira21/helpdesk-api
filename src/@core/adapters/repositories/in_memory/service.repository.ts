import { ServiceRepository } from 'src/@core/application/ports/repositories/service_repository.port';
import { ServiceEntity } from 'src/@core/domain/entities';

export class InMemoryServiceRepository implements ServiceRepository {
  private services = new Map<string, ServiceEntity>();

  async save(service: ServiceEntity): Promise<void> {
    this.services.set(service.id.value, service);
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    return this.services.get(id) ?? null;
  }
}
