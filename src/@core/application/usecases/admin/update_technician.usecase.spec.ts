import {
  InMemoryAdminRepository,
  InMemoryTechnicianRepository,
} from 'src/@core/adapters/repositories/in_memory';
import { UpdateTechnicianInput } from 'src/@core/domain/usecases/admin/update_technician.usecase';

import { UpdateTechnician } from './update_technician.usecase';
import { AdminEntity, TechnicianEntity } from 'src/@core/domain/entities';

describe('UpdateTechnicianUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const technicianRepository = new InMemoryTechnicianRepository();
    const useCase = new UpdateTechnician(adminRepository, technicianRepository);

    return {
      useCase,
      adminRepository,
      technicianRepository,
    };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase } = createUseCase();
    const input: UpdateTechnicianInput = {
      technicianId: 'tech-id',
      adminId: 'non-existent-admin-id',
      name: 'New Name',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });

  it('should throw an error if technician is not found', async () => {
    const { useCase, adminRepository } = createUseCase();
    const admin = await AdminEntity.create({
      name: 'Admin',
      email: 'admin@example.com',
      plainTextPassword: 'password',
    });
    await adminRepository.save(admin);

    const input: UpdateTechnicianInput = {
      technicianId: 'non-existent-tech-id',
      adminId: admin.id.value,
      name: 'New Name',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Technician not found',
    );
  });

  it('should update technician successfully', async () => {
    const { useCase, adminRepository, technicianRepository } = createUseCase();
    const admin = await AdminEntity.create({
      name: 'Admin',
      email: 'admin@example.com',
      plainTextPassword: 'password',
    });
    await adminRepository.save(admin);

    const technician = await TechnicianEntity.create({
      name: 'Tech One',
      email: 'tech.one@example.com',
      plainTextPassword: 'password',
      createdBy: admin,
    });
    await technicianRepository.save(technician);

    const input: UpdateTechnicianInput = {
      technicianId: technician.id.value,
      adminId: admin.id.value,
      name: 'New Name',
      email: 'tech.one.updated@example.com',
      shift: [9, 10, 11],
    };

    await useCase.execute(input);

    const updatedTechnician = await technicianRepository.findById(
      technician.id.value,
    );

    expect(updatedTechnician).toBeDefined();
    expect(updatedTechnician?.name).toBe(input.name);
    expect(updatedTechnician?.email.value).toBe(input.email);
    expect(updatedTechnician?.shift.map((h) => h.value)).toEqual(input.shift);
  });
});
