import { DataSource, Repository } from 'typeorm';

import { AdminEntity } from 'src/@core/domain/entities';
import { UserRoleEnum } from 'src/@core/domain/enum/user_role.enum';
import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';

import { Admin } from './entities';

export class TypeORMAdminRepository implements AdminRepository {
  private readonly adminRepo: Repository<Admin>;

  constructor(dataSource: DataSource) {
    this.adminRepo = dataSource.getRepository(Admin);
  }

  async findById(id: string): Promise<AdminEntity | null> {
    const admin = await this.adminRepo.findOne({
      where: { id, roleId: UserRoleEnum.ADMIN },
    });

    if (!admin) return null;

    return admin.toDomain();
  }
}
