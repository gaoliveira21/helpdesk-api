import { TicketStatusEnum } from '../enum/ticket_status.enum';
import { Uuid } from '../value_objects';
import { ServiceEntity } from './service.entity';
import { TicketEntity } from './ticket.entity';

describe('TicketEntity', () => {
  it('should create a TicketEntity with default status when no status is provided', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    expect(ticket).toBeInstanceOf(TicketEntity);
    expect(ticket.status).toEqual(TicketStatusEnum.OPEN);
  });

  it('should throw an error if no services are provided', () => {
    expect(() => {
      TicketEntity.create({
        name: 'Sample Ticket',
        description: 'This is a sample ticket description.',
        customerId: new Uuid().toString(),
        services: [],
      });
    }).toThrow('A ticket must have at least one service.');
  });

  it('should check if the ticket is closed', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    expect(ticket.isClosed()).toBe(false);

    ticket.close();

    expect(ticket.isClosed()).toBe(true);
  });

  it('should check if the ticket is in progress', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    expect(ticket.isOpen()).toBe(true);

    ticket.close();

    expect(ticket.isOpen()).toBe(false);
  });

  it('should close the ticket', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    ticket.close();

    expect(ticket.status).toEqual(TicketStatusEnum.CLOSED);
  });

  it('should throw an error if ticket is already closed', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    ticket.close();

    expect(() => ticket.close()).toThrow('Ticket is already closed.');
  });

  it('should reopen the ticket', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    ticket.close();
    ticket.reopen();

    expect(ticket.status).toEqual(TicketStatusEnum.OPEN);
  });

  it('should throw an error if ticket is already in progress', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
    });

    expect(() => ticket.reopen()).toThrow('Ticket is already open.');
  });

  it('should restore a TicketEntity from given data', () => {
    const id = new Uuid().toString();
    const name = 'Restored Ticket';
    const description = 'This ticket has been restored from data.';
    const customerId = new Uuid().toString();
    const services = [
      ServiceEntity.create({
        name: 'Service 1',
        price: 100,
        adminId: new Uuid().toString(),
      }),
    ];
    const status = TicketStatusEnum.CLOSED;
    const technicianId = new Uuid().toString();
    const createdAt = new Date();
    const updatedAt = new Date();

    const ticket = TicketEntity.restore({
      id,
      name,
      description,
      customerId,
      services,
      status,
      technicianId,
      createdAt,
      updatedAt,
    });

    expect(ticket).toBeInstanceOf(TicketEntity);
    expect(ticket.id.toString()).toBe(id);
    expect(ticket.name).toBe(name);
    expect(ticket.description).toBe(description);
    expect(ticket.customerId.toString()).toBe(customerId);
    expect(ticket.services).toEqual(services);
    expect(ticket.status).toBe(status);
    expect(ticket.technicianId?.toString()).toBe(technicianId);
    expect(ticket.createdAt).toBe(createdAt);
    expect(ticket.updatedAt).toBe(updatedAt);
  });

  it('should convert TicketEntity to JSON correctly', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
      technicianId: new Uuid().toString(),
    });

    const ticketJson = ticket.toJSON();

    expect(ticketJson).toEqual({
      id: ticket.id.toString(),
      name: ticket.name,
      description: ticket.description,
      customerId: ticket.customerId.toString(),
      services: ticket.services.map((service) => service.toJSON()),
      status: ticket.status,
      technicianId: ticket.technicianId?.toString(),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    });
  });

  it('should return a correct string representation of TicketEntity', () => {
    const ticket = TicketEntity.create({
      name: 'Sample Ticket',
      description: 'This is a sample ticket description.',
      customerId: new Uuid().toString(),
      services: [
        ServiceEntity.create({
          name: 'Service 1',
          price: 100,
          adminId: new Uuid().toString(),
        }),
      ],
      technicianId: new Uuid().toString(),
    });

    const ticketString = ticket.toString();

    expect(ticketString).toContain(`id: ${ticket.id.toString()}`);
    expect(ticketString).toContain(`name: ${ticket.name}`);
    expect(ticketString).toContain(`description: ${ticket.description}`);
    expect(ticketString).toContain(
      `customerId: ${ticket.customerId.toString()}`,
    );
    expect(ticketString).toContain(`status: ${ticket.status}`);
    expect(ticketString).toContain(
      `technicianId: ${ticket.technicianId?.toString()}`,
    );
    expect(ticketString).toContain(
      `createdAt: ${ticket.createdAt.toISOString()}`,
    );
    expect(ticketString).toContain(
      `updatedAt: ${ticket.updatedAt.toISOString()}`,
    );
  });
});
