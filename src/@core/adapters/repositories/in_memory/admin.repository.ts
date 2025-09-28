import { AdminRepository } from 'src/@core/application/ports/admin.repository';
import { AdminEntity } from 'src/@core/domain/entities';

export class InMemoryAdminRepository implements AdminRepository {
  private admins = new Map<string, AdminEntity>();

  constructor(initialAdmins: AdminEntity[] = []) {
    initialAdmins.forEach((admin) =>
      this.admins.set(admin.id.toString(), admin),
    );
  }

  async findById(id: string): Promise<AdminEntity | null> {
    return this.admins.get(id) ?? null;
  }
}
