import { UseCase } from '../usecase.interface';

export interface UpdateTechnicianInput {
  technicianId: string;
  adminId: string;
  name?: string;
  email?: string;
  shift?: number[];
}

export interface UpdateTechnicianUseCase
  extends UseCase<UpdateTechnicianInput, void> {}
