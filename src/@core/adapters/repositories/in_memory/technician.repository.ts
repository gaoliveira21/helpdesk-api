import { TechnicianRepository } from 'src/@core/application/ports/repositories/technician_repository.port';
import { TechnicianEntity } from 'src/@core/domain/entities';

export class InMemoryTechnicianRepository implements TechnicianRepository {
  private technicians = new Map<string, TechnicianEntity>();

  async findById(id: string): Promise<TechnicianEntity | null> {
    return this.technicians.get(id) ?? null;
  }

  async save(technician: TechnicianEntity): Promise<void> {
    this.technicians.set(technician.id.toString(), technician);
  }
}
