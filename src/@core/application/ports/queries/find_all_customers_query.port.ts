export interface FindAllCustomersFilters {
  page: number;
  limit: number;
}

export interface CustomersFound {
  count: number;
  customers: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface FindAllCustomersQuery {
  findAll(filters: FindAllCustomersFilters): Promise<CustomersFound>;
}
