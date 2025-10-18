import { TicketRepository } from 'src/@core/application/ports/repositories/ticket_repository.port';
import { TicketEntity } from 'src/@core/domain/entities/ticket.entity';

export class InMemoryTicketRepository implements TicketRepository {
  private tickets: Map<string, TicketEntity> = new Map();

  async save(ticket: TicketEntity): Promise<void> {
    this.tickets.set(ticket.id.value, ticket);
  }

  async findById(ticketId: string): Promise<TicketEntity | null> {
    return this.tickets.get(ticketId) || null;
  }
}
