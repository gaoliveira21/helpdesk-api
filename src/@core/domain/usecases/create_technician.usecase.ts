import { UseCase } from './usecase.interface';

export interface CreateTechnicianInput {
  name: string;
  email: string;
  adminId: string;
  shift?: number[];
}

export interface CreateTechnicianOutput {
  id: string;
}

export interface CreateTechnicianUseCase
  extends UseCase<CreateTechnicianInput, CreateTechnicianOutput> {}
