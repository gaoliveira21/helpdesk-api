import { ServiceEntity } from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';

import { Service } from './service';

describe('TypeORMServiceEntity', () => {
  it('should create a Service instance from a domain ServiceEntity', () => {
    const serviceEntity = ServiceEntity.restore({
      id: new Uuid().value,
      name: 'Premium Support',
      price: 199.99,
      active: true,
      adminId: new Uuid().value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = Service.fromDomain(serviceEntity);

    expect(service).toBeInstanceOf(Service);
    expect(service.id).toEqual(serviceEntity.id.value);
    expect(service.name).toEqual(serviceEntity.name);
    expect(service.price).toEqual(serviceEntity.price.value);
    expect(service.active).toEqual(serviceEntity.isActive());
    expect(service.adminId).toEqual(serviceEntity.adminId.value);
    expect(service.createdAt).toEqual(serviceEntity.createdAt);
    expect(service.updatedAt).toEqual(serviceEntity.updatedAt);
  });

  it('should return a domain ServiceEntity instance when toDomain is called', () => {
    const service = new Service();
    service.id = new Uuid().value;
    service.name = 'Premium Support';
    service.price = 199.99;
    service.active = true;
    service.adminId = new Uuid().value;
    service.createdAt = new Date();
    service.updatedAt = new Date();

    const serviceEntity = service.toDomain();

    expect(serviceEntity).toBeInstanceOf(ServiceEntity);
    expect(serviceEntity.id.value).toEqual(service.id);
    expect(serviceEntity.name).toEqual(service.name);
    expect(serviceEntity.price.value).toEqual(service.price);
    expect(serviceEntity.isActive()).toEqual(service.active);
    expect(serviceEntity.adminId.value).toEqual(service.adminId);
    expect(serviceEntity.createdAt).toEqual(service.createdAt);
    expect(serviceEntity.updatedAt).toEqual(service.updatedAt);
  });
});
