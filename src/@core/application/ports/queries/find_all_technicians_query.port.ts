export interface TechniciansFound {
  count: number;
  technicians: Array<{
    id: string;
    name: string;
    email: string;
    shift: number[];
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface FindAllTechniciansFilters {
  page: number;
  limit: number;
}

export interface FindAllTechniciansQuery {
  findAll(filters: FindAllTechniciansFilters): Promise<TechniciansFound>;
}
