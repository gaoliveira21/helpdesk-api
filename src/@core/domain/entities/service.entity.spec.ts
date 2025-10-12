import { Uuid } from '../value_objects';
import { AdminEntity } from './admin.entity';
import { ServiceEntity } from './service.entity';

describe('ServiceEntity', () => {
  const createdAdmin = () => {
    return AdminEntity.restore({
      id: new Uuid().value,
      name: 'Admin 1',
      email: 'admin1@example.com',
      passwordHash: 'admin123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  it('should create a service entity', () => {
    const admin = createdAdmin();

    const service = ServiceEntity.create({
      name: 'Test Service',
      price: 100,
      createdBy: admin,
    });

    expect(service).toBeInstanceOf(ServiceEntity);
    expect(service.id).toBeDefined();
    expect(service.name).toBe('Test Service');
    expect(service.price).toBe(100);
    expect(service.isActive()).toBe(true);
    expect(service.createdBy.isEqual(admin)).toBe(true);
    expect(service.createdAt).toBeInstanceOf(Date);
    expect(service.updatedAt).toBeInstanceOf(Date);
  });

  it('should restore a service entity', () => {
    const admin = createdAdmin();
    const id = new Uuid();
    const now = new Date();
    const service = ServiceEntity.restore({
      id: id.value,
      name: 'Restored Service',
      price: 200,
      active: true,
      createdAt: now,
      updatedAt: now,
      createdBy: admin,
    });

    expect(service).toBeInstanceOf(ServiceEntity);
    expect(service.id.value).toBe(id.value);
    expect(service.name).toBe('Restored Service');
    expect(service.price).toBe(200);
    expect(service.isActive()).toBe(true);
    expect(service.createdAt).toBe(now);
    expect(service.updatedAt).toBe(now);
    expect(service.createdBy.isEqual(admin)).toBe(true);
  });

  it('should convert to string', () => {
    const admin = createdAdmin();
    const service = ServiceEntity.create({
      name: 'String Service',
      price: 150,
      createdBy: admin,
    });

    const str = service.toString();
    expect(str).toBe(
      `ServiceEntity { id: ${service.id.value}, name: ${service.name}, price: ${service.price}, active: ${service.isActive()}, createdAt: ${service.createdAt.toISOString()}, updatedAt: ${service.updatedAt.toISOString()}, createdBy: ${service.createdBy.toString()} }`,
    );
  });

  it('should convert to JSON', () => {
    const admin = createdAdmin();
    const service = ServiceEntity.create({
      name: 'JSON Service',
      price: 250,
      createdBy: admin,
    });

    const json = service.toJSON();
    expect(json).toEqual({
      id: service.id.value,
      name: 'JSON Service',
      price: 250,
      active: true,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      createdBy: service.createdBy.toJSON(),
    });
  });

  it('should deactivate the service', () => {
    const admin = createdAdmin();
    const service = ServiceEntity.create({
      name: 'Active Service',
      price: 300,
      createdBy: admin,
    });

    expect(service.isActive()).toBe(true);
    const beforeUpdate = service.updatedAt;

    service.deactivate();

    expect(service.isActive()).toBe(false);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should activate the service', () => {
    const admin = createdAdmin();
    const service = ServiceEntity.create({
      name: 'Inactive Service',
      price: 350,
      createdBy: admin,
    });

    service.deactivate();
    expect(service.isActive()).toBe(false);
    const beforeUpdate = service.updatedAt;

    service.activate();

    expect(service.isActive()).toBe(true);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should change the name', () => {
    const admin = createdAdmin();
    const service = ServiceEntity.create({
      name: 'Old Name Service',
      price: 400,
      createdBy: admin,
    });

    const beforeUpdate = service.updatedAt;
    service.changeName('New Name Service');

    expect(service.name).toBe('New Name Service');
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should change the price', () => {
    const admin = createdAdmin();
    const service = ServiceEntity.create({
      name: 'Pricey Service',
      price: 500,
      createdBy: admin,
    });

    const beforeUpdate = service.updatedAt;
    service.changePrice(600);

    expect(service.price).toBe(600);
    expect(service.updatedAt).not.toBe(beforeUpdate);
  });

  it('should throw an error if price is invalid', () => {
    const admin = createdAdmin();
    expect(() =>
      ServiceEntity.create({
        name: 'Invalid Service',
        price: -100,
        createdBy: admin,
      }),
    ).toThrow('Price must be greater than zero');
  });
});
