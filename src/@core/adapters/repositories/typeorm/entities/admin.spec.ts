import { AdminEntity } from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';

import { Admin } from './admin';

describe('TypeORMAdminEntity', () => {
  it('should create a Admin instance from a domain AdminEntity', () => {
    const adminEntity = AdminEntity.restore({
      id: new Uuid().value,
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const admin = Admin.fromDomain(adminEntity);

    expect(admin).toBeInstanceOf(Admin);
    expect(admin.id).toEqual(adminEntity.id.value);
    expect(admin.name).toEqual(adminEntity.name);
    expect(admin.email).toEqual(adminEntity.email.value);
    expect(admin.passwordHash).toEqual(adminEntity.passwordHash.value);
    expect(admin.roleId).toEqual(adminEntity.role);
    expect(admin.createdAt).toEqual(adminEntity.createdAt);
    expect(admin.updatedAt).toEqual(adminEntity.updatedAt);
  });

  it('should return an domain AdminEntity instance when toDomain is called', () => {
    const admin = new Admin();
    admin.id = new Uuid().value;
    admin.name = 'John Doe';
    admin.email = 'john.doe@example.com';
    admin.passwordHash = 'hashed_password';
    admin.roleId = 1;
    admin.createdAt = new Date();
    admin.updatedAt = new Date();

    const adminEntity = admin.toDomain();

    expect(adminEntity).toBeInstanceOf(AdminEntity);
    expect(adminEntity.id.value).toEqual(admin.id);
    expect(adminEntity.name).toEqual(admin.name);
    expect(adminEntity.email.value).toEqual(admin.email);
    expect(adminEntity.passwordHash.value).toEqual(admin.passwordHash);
    expect(adminEntity.role).toEqual(admin.roleId);
    expect(adminEntity.createdAt).toEqual(admin.createdAt);
    expect(adminEntity.updatedAt).toEqual(admin.updatedAt);
  });
});
