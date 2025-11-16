import { AdminEntity } from 'src/@core/domain/entities';

export interface AdminRepository {
  findById(id: string): Promise<AdminEntity | null>;
}

export const AdminRepository = Symbol('AdminRepository');
