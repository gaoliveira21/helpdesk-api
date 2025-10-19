import {
  InMemoryAdminRepository,
  InMemoryTicketRepository,
} from 'src/@core/adapters/repositories/in_memory';
import { ReopenTicket } from './reopen_ticket.usecase';
import {
  AdminEntity,
  ServiceEntity,
  TicketEntity,
} from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';

describe('ReopenTicketUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const ticketRepository = new InMemoryTicketRepository();
    const useCase = new ReopenTicket(adminRepository, ticketRepository);

    return { useCase, adminRepository, ticketRepository };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ ticketId: 'ticket-1', adminId: 'non-existent-admin' }),
    ).rejects.toThrow('Admin not found');
  });

  it('should throw an error if ticket is not found', async () => {
    const { useCase, adminRepository } = createUseCase();
    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'admin123',
    });
    await adminRepository.save(admin);

    await expect(
      useCase.execute({
        ticketId: 'non-existent-ticket',
        adminId: admin.id.value,
      }),
    ).rejects.toThrow('Ticket not found');
  });

  it('should reopen a ticket successfully', async () => {
    const { useCase, adminRepository, ticketRepository } = createUseCase();
    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'admin123',
    });
    await adminRepository.save(admin);

    const ticket = TicketEntity.create({
      name: 'Test Ticket',
      description: 'This is a test ticket',
      customerId: new Uuid().value,
      services: [
        ServiceEntity.create({
          name: 'Test Service',
          price: 100,
          adminId: admin.id.value,
        }),
      ],
    });

    ticket.close();
    await ticketRepository.save(ticket);

    await useCase.execute({
      ticketId: ticket.id.value,
      adminId: admin.id.value,
    });

    const updatedTicket = await ticketRepository.findById(ticket.id.value);
    expect(updatedTicket?.isInProgress()).toBe(true);
  });

  it('should not change ticket status if already in progress', async () => {
    const { useCase, adminRepository, ticketRepository } = createUseCase();
    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'admin123',
    });
    await adminRepository.save(admin);

    const ticket = TicketEntity.create({
      name: 'Test Ticket',
      description: 'This is a test ticket',
      customerId: new Uuid().value,
      services: [
        ServiceEntity.create({
          name: 'Test Service',
          price: 100,
          adminId: admin.id.value,
        }),
      ],
    });
    await ticketRepository.save(ticket);

    await useCase.execute({
      ticketId: ticket.id.value,
      adminId: admin.id.value,
    });

    const updatedTicket = await ticketRepository.findById(ticket.id.value);
    expect(updatedTicket?.isInProgress()).toBe(true);
  });
});
