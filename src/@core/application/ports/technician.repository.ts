import { TechnicianEntity } from 'src/@core/domain/entities';

export interface TechnicianRepository {
  save(technician: TechnicianEntity): Promise<void>;
}
