import { TicketStatusEnum } from '../enum/ticket_status.enum';
import { Uuid } from '../value_objects';
import { Entity } from './entity.abstract';
import { ServiceEntity } from './service.entity';

export type CreateTicketProps = {
  name: string;
  description: string;
  customerId: string;
  services: ServiceEntity[];
  technicianId?: string;
};

export type RestoreTicketProps = {
  id: string;
  name: string;
  description: string;
  customerId: string;
  services: ServiceEntity[];
  status: TicketStatusEnum;
  technicianId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class TicketEntity extends Entity {
  private _name: string;
  private _description: string;
  private _status: TicketStatusEnum;
  private _customerId: Uuid;
  private _services: ServiceEntity[];
  private _technicianId?: Uuid;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    description: string,
    customerId: Uuid,
    services: ServiceEntity[],
    status: TicketStatusEnum,
    createdAt: Date,
    updatedAt: Date,
    technicianId?: Uuid,
  ) {
    super(id);
    this._name = name;
    this._description = description;
    this._customerId = customerId;
    this._services = services;
    this._status = status;
    this._technicianId = technicianId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create({
    name,
    description,
    customerId,
    services,
    technicianId,
  }: CreateTicketProps): TicketEntity {
    if (services.length === 0) {
      throw new Error('A ticket must have at least one service.');
    }

    return new TicketEntity(
      new Uuid(),
      name,
      description,
      new Uuid(customerId),
      services,
      TicketStatusEnum.OPEN,
      new Date(),
      new Date(),
      technicianId ? new Uuid(technicianId) : undefined,
    );
  }

  static restore({
    id,
    name,
    description,
    customerId,
    services,
    status,
    technicianId,
    createdAt,
    updatedAt,
  }: RestoreTicketProps): TicketEntity {
    return new TicketEntity(
      new Uuid(id),
      name,
      description,
      new Uuid(customerId),
      services,
      status,
      createdAt,
      updatedAt,
      technicianId ? new Uuid(technicianId) : undefined,
    );
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get status(): TicketStatusEnum {
    return this._status;
  }

  get customerId(): Uuid {
    return this._customerId;
  }

  get services(): ServiceEntity[] {
    return this._services;
  }

  get technicianId(): Uuid | undefined {
    return this._technicianId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isClosed(): boolean {
    return this._status === TicketStatusEnum.CLOSED;
  }

  isOpen(): boolean {
    return this._status === TicketStatusEnum.OPEN;
  }

  close(): void {
    if (this.isClosed()) {
      throw new Error('Ticket is already closed.');
    }

    this._status = TicketStatusEnum.CLOSED;
    this._updatedAt = new Date();
  }

  reopen(): void {
    if (this.isOpen()) {
      throw new Error('Ticket is already open.');
    }

    this._status = TicketStatusEnum.OPEN;
    this._updatedAt = new Date();
  }

  toString(): string {
    return `TicketEntity {
      id: ${this.id.toString()},
      name: ${this.name},
      description: ${this.description},
      customerId: ${this.customerId.toString()},
      services: [${this.services.map((service) => service.toString()).join(', ')}],
      status: ${this.status},
      technicianId: ${this.technicianId ? this.technicianId.toString() : 'undefined'},
      createdAt: ${this.createdAt.toISOString()},
      updatedAt: ${this.updatedAt.toISOString()}
    }`;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      customerId: this.customerId.toString(),
      services: this.services.map((service) => service.toJSON()),
      status: this.status,
      technicianId: this.technicianId
        ? this.technicianId.toString()
        : undefined,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
