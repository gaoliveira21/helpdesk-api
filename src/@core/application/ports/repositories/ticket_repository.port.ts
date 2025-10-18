import { TicketEntity } from 'src/@core/domain/entities';

export interface TicketRepository {
  save(ticket: TicketEntity): Promise<void>;
  findById(ticketId: string): Promise<TicketEntity | null>;
}
