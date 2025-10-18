import {
  ReopenTicketInput,
  ReopenTicketUseCase,
} from 'src/@core/domain/usecases/admin/reopen_ticket.usecase';
import { AdminRepository } from 'src/@core/application/ports/repositories/admin_repository.port';
import { TicketRepository } from 'src/@core/application/ports/repositories/ticket_repository.port';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

export class ReopenTicket implements ReopenTicketUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute({
    ticketId,
    adminId,
  }: ReopenTicketInput): Promise<Result<void>> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    admin.reopenTicket(ticket);
    await this.ticketRepository.save(ticket);

    return { error: null };
  }
}
