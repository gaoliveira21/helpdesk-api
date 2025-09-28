import { Email, Uuid, PasswordHash, Hour } from '../value_objects';

import { UserEntity } from './user.abstract';

export class TechnicianEntity extends UserEntity {
  public static readonly DEFAULT_SHIFT: Hour[] = [
    new Hour(8),
    new Hour(9),
    new Hour(10),
    new Hour(11),
    new Hour(12),
    new Hour(13),
    new Hour(14),
    new Hour(15),
    new Hour(16),
    new Hour(17),
  ];
  private _shift: Hour[];

  private constructor(
    id: Uuid,
    name: string,
    email: Email,
    passwordHash: PasswordHash,
    shift: Hour[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, name, email, passwordHash, createdAt, updatedAt);
    this._shift = shift;
  }

  static async create(
    name: string,
    email: string,
    plainTextPassword: string,
    shift?: number[],
  ): Promise<TechnicianEntity> {
    const passwordHash = await PasswordHash.create(plainTextPassword);
    return new TechnicianEntity(
      new Uuid(),
      name,
      new Email(email),
      passwordHash,
      shift
        ? shift.map((hour) => new Hour(hour))
        : TechnicianEntity.DEFAULT_SHIFT,
    );
  }

  static restore(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    shift: number[],
    createdAt: Date,
    updatedAt: Date,
  ): TechnicianEntity {
    return new TechnicianEntity(
      new Uuid(id),
      name,
      new Email(email),
      PasswordHash.fromHash(passwordHash),
      shift.map((hour) => new Hour(hour)),
      createdAt,
      updatedAt,
    );
  }

  get shift(): Hour[] {
    return this._shift;
  }

  toString(): string {
    return `TechnicianEntity { id: ${this._id.toString()}, name: ${this._name}, email: ${this._email.toString()}, createdAt: ${this._createdAt.toISOString()}, updatedAt: ${this._updatedAt.toISOString()}, shift: [${this._shift
      .map((hour) => hour.toString())
      .join(', ')}] }`;
  }
}
