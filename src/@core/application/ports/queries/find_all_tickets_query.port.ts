export interface TicketsFound {
  count: number;
  tickets: Array<{
    id: string;
    name: string;
    status: string;
    customer: {
      id: string;
      name: string;
    };
    technician: {
      id: string;
      name: string;
    };
    services: {
      name: string;
      price: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface FindAllTicketsFilters {
  page: number;
  limit: number;
}

export interface FindAllTicketsQuery {
  findAll(filters: FindAllTicketsFilters): Promise<TicketsFound>;
}
