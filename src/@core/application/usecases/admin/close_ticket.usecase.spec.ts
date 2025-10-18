import { CloseTicketInput } from 'src/@core/domain/usecases/admin/close_ticket.usecase';
import {
  InMemoryAdminRepository,
  InMemoryTicketRepository,
} from 'src/@core/adapters/repositories/in_memory';

import { CloseTicket } from './close_ticket.usecase';
import {
  AdminEntity,
  ServiceEntity,
  TicketEntity,
} from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';

describe('CloseTicketUseCase', () => {
  const createUseCase = () => {
    const adminRepository = new InMemoryAdminRepository();
    const ticketRepository = new InMemoryTicketRepository();

    const useCase = new CloseTicket(adminRepository, ticketRepository);
    return { useCase, adminRepository, ticketRepository };
  };

  it('should throw an error if admin is not found', async () => {
    const { useCase } = createUseCase();
    const input: CloseTicketInput = {
      ticketId: 'some-ticket-id',
      adminId: 'non-existent-admin-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });

  it('should throw an error if ticket is not found', async () => {
    const { useCase, adminRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'securepassword',
    });
    await adminRepository.save(admin);

    const input: CloseTicketInput = {
      ticketId: 'non-existent-ticket-id',
      adminId: admin.id.value,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Ticket not found');
  });

  it('should successfully close an open ticket', async () => {
    const { useCase, adminRepository, ticketRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'securepassword',
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

    const input: CloseTicketInput = {
      ticketId: ticket.id.value,
      adminId: admin.id.value,
    };

    const result = await useCase.execute(input);
    expect(result.error).toBeNull();

    const closedTicket = await ticketRepository.findById(ticket.id.value);
    expect(closedTicket).toBeDefined();
    expect(closedTicket?.isClosed()).toBe(true);
  });

  it('should do nothing if the ticket is already closed', async () => {
    const { useCase, adminRepository, ticketRepository } = createUseCase();

    const admin = await AdminEntity.create({
      name: 'Admin User',
      email: 'admin@example.com',
      plainTextPassword: 'securepassword',
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

    const input: CloseTicketInput = {
      ticketId: ticket.id.value,
      adminId: admin.id.value,
    };

    const result = await useCase.execute(input);
    expect(result.error).toBeNull();

    const closedTicket = await ticketRepository.findById(ticket.id.value);
    expect(closedTicket).toBeDefined();
    expect(closedTicket?.isClosed()).toBe(true);
  });
});
