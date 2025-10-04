import {
  CreateTechnicianInput,
  CreateTechnicianOutput,
  CreateTechnicianUseCase,
} from 'src/@core/domain/usecases/create_technician.usecase';
import { TechnicianEntity } from 'src/@core/domain/entities';

import { AdminRepository } from '../ports/admin_repository.port';
import { PasswordGenerator } from '../ports/password_generator.port';
import { TechnicianRepository } from '../ports/technician_repository.port';

export class CreateTechnician implements CreateTechnicianUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordGenerator: PasswordGenerator,
    private readonly technicianRepository: TechnicianRepository,
  ) {}

  async execute(input: CreateTechnicianInput): Promise<CreateTechnicianOutput> {
    const admin = await this.adminRepository.findById(input.adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const password = this.passwordGenerator.generate();

    const technician = await TechnicianEntity.create({
      name: input.name,
      email: input.email,
      plainTextPassword: password,
      createdBy: admin,
      shift: input.shift,
    });

    await this.technicianRepository.save(technician);

    return {
      id: technician.id.value,
    };
  }
}
