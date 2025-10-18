import { Price, Uuid } from '../value_objects';
import { Entity } from './entity.abstract';

export type CreateServiceProps = {
  name: string;
  price: number;
  adminId: string;
};

export type RestoreServiceProps = {
  id: string;
  name: string;
  price: number;
  adminId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class ServiceEntity extends Entity {
  private _name: string;
  private _price: Price;
  private _active: boolean;
  private _adminId: Uuid;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    price: Price,
    adminId: Uuid,
    active: boolean = true,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this._name = name;
    this._price = price;
    this._active = active;
    this._adminId = adminId;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create({ name, price, adminId }: CreateServiceProps): ServiceEntity {
    return new ServiceEntity(
      new Uuid(),
      name,
      new Price(price),
      new Uuid(adminId),
    );
  }

  static restore({
    id,
    name,
    price,
    adminId,
    active,
    createdAt,
    updatedAt,
  }: RestoreServiceProps): ServiceEntity {
    return new ServiceEntity(
      new Uuid(id),
      name,
      new Price(price),
      new Uuid(adminId),
      active,
      createdAt,
      updatedAt,
    );
  }

  get name(): string {
    return this._name;
  }

  get price(): Price {
    return this._price;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get adminId(): Uuid {
    return this._adminId;
  }

  changeName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  changePrice(price: number): void {
    this._price = new Price(price);
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._active;
  }

  deactivate(): void {
    this._active = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._active = true;
    this._updatedAt = new Date();
  }

  toString(): string {
    return `ServiceEntity { id: ${this.id.value}, name: ${this.name}, price: ${this.price.toString()}, active: ${this.isActive()}, createdAt: ${this.createdAt.toISOString()}, updatedAt: ${this.updatedAt.toISOString()}, adminId: ${this.adminId.toString()} }`;
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      price: this.price.value,
      active: this.isActive(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      adminId: this.adminId.toString(),
    };
  }
}
