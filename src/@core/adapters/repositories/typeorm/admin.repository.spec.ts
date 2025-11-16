import { DataSource } from 'typeorm';

import { Admin, User, UserRole } from './entities';
import { TypeORMAdminRepository } from './admin.repository';
import { UserRoleEnum } from 'src/@core/domain/enum/user_role.enum';
import { Uuid } from 'src/@core/domain/value_objects';

describe('TypeORMAdminRepository', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      entities: [User, UserRole, Admin],
    });
    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('findById', () => {
    it('should return null if admin does not exist', async () => {
      const adminRepository = new TypeORMAdminRepository(dataSource);

      const admin = await adminRepository.findById('non-existing-id');
      expect(admin).toBeNull();
    });

    it('should return null if user is not an admin', async () => {
      const adminRepository = new TypeORMAdminRepository(dataSource);

      await dataSource.manager.insert(UserRole, {
        id: UserRoleEnum.CUSTOMER,
        name: 'Customer',
      });
      const userId = 'user-id-123';
      await dataSource.manager.insert(Admin, {
        id: userId,
        name: 'Regular User',
        email: 'regular.user@example.com',
        passwordHash: 'hashed-password',
        roleId: UserRoleEnum.CUSTOMER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const user = await adminRepository.findById(userId);
      expect(user).toBeNull();
    });

    it('should return an AdminEntity if admin exists', async () => {
      const adminRepository = new TypeORMAdminRepository(dataSource);

      await dataSource.manager.insert(UserRole, {
        id: UserRoleEnum.ADMIN,
        name: 'Admin',
      });
      const adminId = new Uuid().value;
      await dataSource.manager.insert(Admin, {
        id: adminId,
        name: 'Admin User',
        email: 'admin.user@example.com',
        passwordHash: 'hashed-password',
        roleId: UserRoleEnum.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const admin = await adminRepository.findById(adminId);
      expect(admin).not.toBeNull();
    });
  });
});
