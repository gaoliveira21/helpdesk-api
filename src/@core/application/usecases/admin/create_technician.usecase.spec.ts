import { CryptoPasswordGenerator } from 'src/@core/adapters/password_generator/crypto_password_generator';
import { CreateTechnicianInput } from 'src/@core/domain/usecases/admin/create_technician.usecase';
import {
  InMemoryAdminRepository,
  InMemoryTechnicianRepository,
} from 'src/@core/adapters/repositories/in_memory';
import { AdminEntity } from 'src/@core/domain/entities';

import { CreateTechnician } from './create_technician.usecase';

describe('CreateTechnicianUseCase', () => {
  const createUseCase = () => {
    const emailSender = {
      sendEmail: jest.fn(),
    };
    const passwordGenerator = new CryptoPasswordGenerator();
    const adminRepository = new InMemoryAdminRepository();
    const technicianRepository = new InMemoryTechnicianRepository();
    const useCase = new CreateTechnician(
      adminRepository,
      passwordGenerator,
      technicianRepository,
      emailSender,
    );

    return {
      useCase,
      adminRepository,
      technicianRepository,
      passwordGenerator,
      emailSender,
    };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase, adminRepository } = createUseCase();
    adminRepository.findById = jest.fn().mockResolvedValueOnce(null);
    const input: CreateTechnicianInput = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      adminId: 'non-existent-admin-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
    expect(adminRepository.findById).toHaveBeenCalledWith(
      'non-existent-admin-id',
    );
  });

  it('should create a technician with a generated password and send it via email', async () => {
    const {
      useCase,
      adminRepository,
      passwordGenerator,
      technicianRepository,
      emailSender,
    } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'adminpassword',
    });
    await adminRepository.save(admin);

    const technicianPassword = 'securepassword';
    passwordGenerator.generate = jest
      .fn()
      .mockReturnValueOnce(technicianPassword);

    const input: CreateTechnicianInput = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      adminId: admin.id.value,
      shift: [1, 2, 3],
    };
    const output = await useCase.execute(input);

    const technician = await technicianRepository.findById(output.id);

    expect(technician).toBeDefined();
    expect(technician?.name).toBe(input.name);
    expect(technician?.email.value).toBe(input.email);
    expect(technician?.createdBy.id.value).toBe(admin.id.value);
    expect(technician?.shift.map((h) => h.value)).toEqual(input.shift);
    expect(technician?.passwordHash).not.toBe(technicianPassword);
    expect(output).toHaveProperty('id');
    expect(output.id).toBe(technician?.id.value);
    expect(passwordGenerator.generate).toHaveBeenCalledTimes(1);
    expect(emailSender.sendEmail).toHaveBeenCalledWith({
      to: technician?.email.value,
      subject: 'Detalhes da sua conta de técnico',
      body: `Olá ${technician?.name},\n\nSua conta foi criada. Sua senha é: ${technicianPassword}\n\nPor favor, altere sua senha após o primeiro login.`,
    });
  });
});
