import {
  CreateTechnicianInput,
  CreateTechnicianOutput,
  CreateTechnicianUseCase,
} from 'src/@core/domain/usecases/create_technician.usecase';

import { AdminRepository } from '../ports/admin_repository.port';
import { PasswordGenerator } from '../ports/password_generator.port';
import { TechnicianRepository } from '../ports/technician_repository.port';
import { EmailSender } from '../ports/email_sender.port';

export class CreateTechnician implements CreateTechnicianUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordGenerator: PasswordGenerator,
    private readonly technicianRepository: TechnicianRepository,
    private readonly emailSender: EmailSender,
  ) {}

  async execute(input: CreateTechnicianInput): Promise<CreateTechnicianOutput> {
    const admin = await this.adminRepository.findById(input.adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const password = this.passwordGenerator.generate();

    const technician = await admin.createTechnician({
      name: input.name,
      email: input.email,
      plainTextPassword: password,
      shift: input.shift,
    });

    await this.technicianRepository.save(technician);

    await this.emailSender.sendEmail({
      to: technician.email.value,
      subject: 'Detalhes da sua conta de técnico',
      body: `Olá ${technician.name},\n\nSua conta foi criada. Sua senha é: ${password}\n\nPor favor, altere sua senha após o primeiro login.`,
    });

    return {
      id: technician.id.value,
    };
  }
}
