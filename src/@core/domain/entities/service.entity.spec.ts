import { Uuid } from '../value_objects';
import { ServiceEntity } from './service.entity';

describe('ServiceEntity', () => {
  it('should create a service entity', () => {
    const service = ServiceEntity.create({
      name: 'Test Service',
      price: 100,
    });

    expect(service).toBeInstanceOf(ServiceEntity);
    expect(service.id).toBeDefined();
    expect(service.name).toBe('Test Service');
    expect(service.price).toBe(100);
    expect(service.isActive()).toBe(true);
    expect(service.createdAt).toBeInstanceOf(Date);
    expect(service.updatedAt).toBeInstanceOf(Date);
  });

  it('should restore a service entity', () => {
    const id = new Uuid();
    const now = new Date();
    const service = ServiceEntity.restore({
      id: id.value,
      name: 'Restored Service',
      price: 200,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    expect(service).toBeInstanceOf(ServiceEntity);
    expect(service.id.value).toBe(id.value);
    expect(service.name).toBe('Restored Service');
    expect(service.price).toBe(200);
    expect(service.isActive()).toBe(true);
    expect(service.createdAt).toBe(now);
    expect(service.updatedAt).toBe(now);
  });

  it('should convert to string', () => {
    const service = ServiceEntity.create({
      name: 'String Service',
      price: 150,
    });

    const str = service.toString();
    expect(str).toBe(
      `ServiceEntity { id: ${service.id.value}, name: ${service.name}, price: ${service.price}, active: ${service.isActive()}, createdAt: ${service.createdAt.toISOString()}, updatedAt: ${service.updatedAt.toISOString()} }`,
    );
  });

  it('should convert to JSON', () => {
    const service = ServiceEntity.create({
      name: 'JSON Service',
      price: 250,
    });

    const json = service.toJSON();
    expect(json).toEqual({
      id: service.id.value,
      name: 'JSON Service',
      price: 250,
      active: true,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    });
  });

  it('should deactivate the service', () => {
    const service = ServiceEntity.create({
      name: 'Active Service',
      price: 300,
    });

    expect(service.isActive()).toBe(true);
    const beforeUpdate = service.updatedAt;

    service.deActivate();

    expect(service.isActive()).toBe(false);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should activate the service', () => {
    const service = ServiceEntity.create({
      name: 'Inactive Service',
      price: 350,
    });

    service.deActivate();
    expect(service.isActive()).toBe(false);
    const beforeUpdate = service.updatedAt;

    service.activate();

    expect(service.isActive()).toBe(true);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should throw an error if price is invalid', () => {
    expect(() =>
      ServiceEntity.create({
        name: 'Invalid Service',
        price: -100,
      }),
    ).toThrow('Price must be greater than zero');
  });
});
