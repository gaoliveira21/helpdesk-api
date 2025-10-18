import { UseCase } from '../usecase.interface';

export interface ReopenTicketInput {
  ticketId: string;
  adminId: string;
}

export interface ReopenTicketUseCase extends UseCase<ReopenTicketInput, void> {}
