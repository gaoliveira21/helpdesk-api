import { Price, Uuid } from '../value_objects';
import { AdminEntity } from './admin.entity';
import { Entity } from './entity.abstract';

export type CreateServiceProps = {
  name: string;
  price: number;
  createdBy: AdminEntity;
};

export type RestoreServiceProps = {
  id: string;
  name: string;
  price: number;
  createdBy: AdminEntity;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class ServiceEntity extends Entity {
  private _name: string;
  private _price: Price;
  private _active: boolean;
  private _createdBy: AdminEntity;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    price: Price,
    createdBy: AdminEntity,
    active: boolean = true,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this._name = name;
    this._price = price;
    this._active = active;
    this._createdBy = createdBy;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create({ name, price, createdBy }: CreateServiceProps): ServiceEntity {
    return new ServiceEntity(new Uuid(), name, new Price(price), createdBy);
  }

  static restore({
    id,
    name,
    price,
    createdBy,
    active,
    createdAt,
    updatedAt,
  }: RestoreServiceProps): ServiceEntity {
    return new ServiceEntity(
      new Uuid(id),
      name,
      new Price(price),
      createdBy,
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

  get createdBy(): AdminEntity {
    return this._createdBy;
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
    return `ServiceEntity { id: ${this.id.value}, name: ${this.name}, price: ${this.price.toString()}, active: ${this.isActive()}, createdAt: ${this.createdAt.toISOString()}, updatedAt: ${this.updatedAt.toISOString()}, createdBy: ${this.createdBy.toString()} }`;
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      price: this.price.value,
      active: this.isActive(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      createdBy: this.createdBy.toJSON(),
    };
  }
}
