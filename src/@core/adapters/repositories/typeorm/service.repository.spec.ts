import { DataSource } from 'typeorm';

import { UserRoleEnum } from 'src/@core/domain/enum/user_role.enum';
import { ServiceEntity } from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';

import { Admin, Service, User, UserRole } from './entities';
import { TypeORMServiceRepository } from './service.repository';

describe('TypeORMServiceRepository', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      entities: [User, UserRole, Admin, Service],
    });
    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('findById', () => {
    it('should return null if service does not exist', async () => {
      const serviceRepository = new TypeORMServiceRepository(dataSource);

      const service = await serviceRepository.findById('non-existing-id');
      expect(service).toBeNull();
    });

    it('should return a ServiceEntity if service exists', async () => {
      const serviceRepository = new TypeORMServiceRepository(dataSource);

      await dataSource.manager.insert(UserRole, {
        id: UserRoleEnum.ADMIN,
        name: 'Admin',
      });
      const adminId = new Uuid().value;
      await dataSource.manager.insert(Admin, {
        id: adminId,
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'hashed-password',
        roleId: UserRoleEnum.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const serviceEntity = ServiceEntity.create({
        name: 'Test Service',
        price: 99.99,
        adminId: adminId,
      });

      await dataSource.manager.insert(
        Service,
        Service.fromDomain(serviceEntity),
      );

      const foundService = await serviceRepository.findById(
        serviceEntity.id.value,
      );
      expect(foundService).not.toBeNull();
      expect(foundService?.id.value).toBe(serviceEntity.id.value);
      expect(foundService?.name).toBe(serviceEntity.name);
      expect(foundService?.price.value).toBe(serviceEntity.price.value);
      expect(foundService?.adminId.value).toBe(serviceEntity.adminId.value);
    });
  });

  describe('save', () => {
    it('should save a ServiceEntity', async () => {
      const serviceRepository = new TypeORMServiceRepository(dataSource);

      await dataSource.manager.insert(UserRole, {
        id: UserRoleEnum.ADMIN,
        name: 'Admin',
      });
      const adminId = new Uuid().value;
      await dataSource.manager.insert(Admin, {
        id: adminId,
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'hashed-password',
        roleId: UserRoleEnum.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const serviceEntity = ServiceEntity.create({
        name: 'Test Service',
        price: 99.99,
        adminId: adminId,
      });

      await dataSource.manager.insert(
        Service,
        Service.fromDomain(serviceEntity),
      );

      const foundService = await serviceRepository.findById(
        serviceEntity.id.value,
      );
      expect(foundService).not.toBeNull();
      expect(foundService?.id.value).toBe(serviceEntity.id.value);
      expect(foundService?.name).toBe(serviceEntity.name);
      expect(foundService?.price.value).toBe(serviceEntity.price.value);
      expect(foundService?.adminId.value).toBe(serviceEntity.adminId.value);
    });
  });

  describe('save', () => {
    it('should save a ServiceEntity', async () => {
      const serviceRepository = new TypeORMServiceRepository(dataSource);

      await dataSource.manager.insert(UserRole, {
        id: UserRoleEnum.ADMIN,
        name: 'Admin',
      });
      const adminId = new Uuid().value;
      await dataSource.manager.insert(Admin, {
        id: adminId,
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'hashed-password',
        roleId: UserRoleEnum.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const serviceEntity = ServiceEntity.create({
        name: 'Test Service',
        price: 99.99,
        adminId: adminId,
      });

      await serviceRepository.save(serviceEntity);

      const foundService = await serviceRepository.findById(
        serviceEntity.id.value,
      );
      expect(foundService).not.toBeNull();
      expect(foundService?.id.value).toBe(serviceEntity.id.value);
      expect(foundService?.name).toBe(serviceEntity.name);
      expect(foundService?.price.value).toBe(serviceEntity.price.value);
      expect(foundService?.adminId.value).toBe(serviceEntity.adminId.value);
    });
  });
});
