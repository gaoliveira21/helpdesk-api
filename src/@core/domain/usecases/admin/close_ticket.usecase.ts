import { UseCase } from '../usecase.interface';

export interface CloseTicketInput {
  ticketId: string;
  adminId: string;
}

export interface CloseTicketUseCase extends UseCase<CloseTicketInput, void> {}
