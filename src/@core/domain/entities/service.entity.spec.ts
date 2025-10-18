import { Uuid } from '../value_objects';
import { ServiceEntity } from './service.entity';

describe('ServiceEntity', () => {
  it('should create a service entity', () => {
    const adminId = new Uuid().value;

    const service = ServiceEntity.create({
      name: 'Test Service',
      price: 100,
      adminId,
    });

    expect(service).toBeInstanceOf(ServiceEntity);
    expect(service.id).toBeDefined();
    expect(service.name).toBe('Test Service');
    expect(service.price.value).toBe(100);
    expect(service.isActive()).toBe(true);
    expect(service.adminId.value).toBe(adminId);
    expect(service.createdAt).toBeInstanceOf(Date);
    expect(service.updatedAt).toBeInstanceOf(Date);
  });

  it('should restore a service entity', () => {
    const adminId = new Uuid().value;
    const id = new Uuid();
    const now = new Date();
    const service = ServiceEntity.restore({
      id: id.value,
      name: 'Restored Service',
      price: 200,
      active: true,
      createdAt: now,
      updatedAt: now,
      adminId,
    });

    expect(service).toBeInstanceOf(ServiceEntity);
    expect(service.id.value).toBe(id.value);
    expect(service.name).toBe('Restored Service');
    expect(service.price.value).toBe(200);
    expect(service.isActive()).toBe(true);
    expect(service.createdAt).toBe(now);
    expect(service.updatedAt).toBe(now);
    expect(service.adminId.value).toBe(adminId);
  });

  it('should convert to string', () => {
    const adminId = new Uuid().value;
    const service = ServiceEntity.create({
      name: 'String Service',
      price: 150,
      adminId,
    });

    const str = service.toString();
    expect(str).toBe(
      `ServiceEntity { id: ${service.id.value}, name: ${service.name}, price: ${service.price.toString()}, active: ${service.isActive()}, createdAt: ${service.createdAt.toISOString()}, updatedAt: ${service.updatedAt.toISOString()}, adminId: ${service.adminId.toString()} }`,
    );
  });

  it('should convert to JSON', () => {
    const adminId = new Uuid().value;
    const service = ServiceEntity.create({
      name: 'JSON Service',
      price: 250,
      adminId,
    });

    const json = service.toJSON();
    expect(json).toEqual({
      id: service.id.value,
      name: 'JSON Service',
      price: 250,
      active: true,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      adminId: service.adminId.toString(),
    });
  });

  it('should deactivate the service', () => {
    const adminId = new Uuid().value;
    const service = ServiceEntity.create({
      name: 'Active Service',
      price: 300,
      adminId,
    });

    expect(service.isActive()).toBe(true);
    const beforeUpdate = service.updatedAt;

    service.deactivate();

    expect(service.isActive()).toBe(false);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should activate the service', () => {
    const adminId = new Uuid().value;
    const service = ServiceEntity.create({
      name: 'Inactive Service',
      price: 350,
      adminId,
    });

    service.deactivate();
    expect(service.isActive()).toBe(false);
    const beforeUpdate = service.updatedAt;

    service.activate();

    expect(service.isActive()).toBe(true);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should change the name', () => {
    const adminId = new Uuid().value;
    const service = ServiceEntity.create({
      name: 'Old Name Service',
      price: 400,
      adminId,
    });

    const beforeUpdate = service.updatedAt;
    service.changeName('New Name Service');

    expect(service.name).toBe('New Name Service');
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should change the price', () => {
    const adminId = new Uuid().value;
    const service = ServiceEntity.create({
      name: 'Pricey Service',
      price: 500,
      adminId,
    });

    const beforeUpdate = service.updatedAt;
    service.changePrice(600);

    expect(service.price.value).toBe(600);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });
});
