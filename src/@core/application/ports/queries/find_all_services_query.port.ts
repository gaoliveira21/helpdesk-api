export interface ServicesFound {
  count: number;
  services: Array<{
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }>;
}

export interface FindAllServicesFilters {
  page: number;
  limit: number;
  isActive?: boolean;
}

export interface FindAllServicesQuery {
  findAll(filters: FindAllServicesFilters): Promise<ServicesFound>;
}
