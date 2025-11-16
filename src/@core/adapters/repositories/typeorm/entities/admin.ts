import { AdminEntity } from 'src/@core/domain/entities';
import { ChildEntity } from 'typeorm';

import { User } from './user';

@ChildEntity()
export class Admin extends User {
  constructor() {
    super();
  }

  static fromDomain(adminEntity: AdminEntity) {
    const admin = new Admin();
    admin.id = adminEntity.id.value;
    admin.name = adminEntity.name;
    admin.email = adminEntity.email.value;
    admin.passwordHash = adminEntity.passwordHash.value;
    admin.roleId = adminEntity.role;
    admin.createdAt = adminEntity.createdAt;
    admin.updatedAt = adminEntity.updatedAt;
    return admin;
  }

  toDomain(): AdminEntity {
    return AdminEntity.restore({
      id: this.id,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
