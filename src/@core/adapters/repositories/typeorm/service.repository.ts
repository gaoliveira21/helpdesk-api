import { DataSource, Repository } from 'typeorm';

import { ServiceRepository } from 'src/@core/application/ports/repositories/service_repository.port';

import { Service } from './entities';
import { ServiceEntity } from 'src/@core/domain/entities';

export class TypeORMServiceRepository implements ServiceRepository {
  private readonly serviceRepo: Repository<Service>;

  constructor(dataSource: DataSource) {
    this.serviceRepo = dataSource.getRepository(Service);
  }

  async save(serviceEntity: ServiceEntity): Promise<void> {
    const service = Service.fromDomain(serviceEntity);
    await this.serviceRepo.save(service);
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const service = await this.serviceRepo.findOneBy({ id });

    if (!service) return null;

    return service.toDomain();
  }
}
