import { Uuid } from '../value_objects/uuid.vo';

export abstract class Entity {
  protected readonly _id: Uuid;

  constructor(id: Uuid) {
    this._id = id;
  }

  get id(): Uuid {
    return this._id;
  }

  isEqual(entity: Entity): boolean {
    return this._id.isEqual(entity.id);
  }

  abstract toString(): string;
  abstract toJSON(): Record<string, unknown>;
}
