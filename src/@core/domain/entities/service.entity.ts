import { Uuid } from '../value_objects';
import { Entity } from './entity.abstract';

export type CreateServiceProps = {
  name: string;
  price: number;
};

export type RestoreServiceProps = {
  id: string;
  name: string;
  price: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class ServiceEntity extends Entity {
  private _name: string;
  private _price: number;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    price: number,
    active: boolean = true,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }

    super(id);
    this._name = name;
    this._price = price;
    this._active = active;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create({ name, price }: CreateServiceProps): ServiceEntity {
    return new ServiceEntity(new Uuid(), name, price);
  }

  static restore({
    id,
    name,
    price,
    active,
    createdAt,
    updatedAt,
  }: RestoreServiceProps): ServiceEntity {
    return new ServiceEntity(
      new Uuid(id),
      name,
      price,
      active,
      createdAt,
      updatedAt,
    );
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isActive(): boolean {
    return this._active;
  }

  deActivate(): void {
    this._active = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._active = true;
    this._updatedAt = new Date();
  }

  toString(): string {
    return `ServiceEntity { id: ${this.id.value}, name: ${this.name}, price: ${this.price}, active: ${this.isActive()}, createdAt: ${this.createdAt.toISOString()}, updatedAt: ${this.updatedAt.toISOString()} }`;
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      price: this.price,
      active: this.isActive(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
